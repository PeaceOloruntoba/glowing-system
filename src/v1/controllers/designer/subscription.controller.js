import Paystack from "paystack-api";
import DesignerProfile from "../../models/designerProfile.model.js";

const paystack = Paystack(process.env.PAYSTACK_SECRET);

const handleSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { plan } = req.body; // Expecting the Paystack plan ID

    const transaction = await paystack.transaction.initialize({
      email: req.user.email,
      plan: plan, // Use the Paystack plan ID
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({
      authorization_url: transaction.data.authorization_url,
      reference: transaction.data.reference,
    });
  } catch (error) {
    console.error("Paystack error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const verification = await paystack.transaction.verify({ reference });

    if (verification.data.status === "success") {
      const { metadata } = verification.data;
      const { userId } = metadata;

      // Check if the user has already had a subscription (to prevent multiple trials)
      const existingProfile = await DesignerProfile.findOne({ userId });

      let expiryDate;
      const now = new Date();
      let subscriptionPlan; // We might not have the plan name directly anymore

      // If the user hasn't had a subscription before, give them a 14-day trial
      if (
        !existingProfile ||
        !existingProfile.subscriptionExpiry ||
        existingProfile.subscriptionExpiry < now
      ) {
        expiryDate = new Date(now.setDate(now.getDate() + 14));
        subscriptionPlan = "trial";
      } else {
        // For existing or non-trial users, we need to fetch the plan details to determine the expiry
        const transactionDetails = await paystack.transaction.fetch(
          verification.data.id
        );
        const planId = transactionDetails.data.plan;
        const planDetails = await paystack.plan.fetch(planId);
        const interval = planDetails.data.interval;

        subscriptionPlan = planDetails.data.name; // Or however you want to store the plan name

        switch (interval) {
          case "monthly":
            expiryDate = new Date(now.setMonth(now.getMonth() + 1));
            break;
          case "biannually": // Paystack uses "biannually"
            expiryDate = new Date(now.setMonth(now.getMonth() + 6));
            break;
          case "annually":
            expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
            break;
          default:
            return res.status(400).json({ message: "Invalid plan interval" });
        }
      }

      await DesignerProfile.findOneAndUpdate(
        { userId: userId },
        {
          subscriptionPlan: subscriptionPlan,
          subscriptionExpiry: expiryDate,
          subActive: true,
        },
        { upsert: true } // Create the profile if it doesn't exist
      );

      res
        .status(200)
        .json({ message: "Payment successful, subscription activated" });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

const getSubscriptionPlans = async (req, res) => {
  try {
    const { data } = await paystack.plan.list();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Paystack plans:", error);
    res.status(500).json({ message: "Failed to fetch subscription plans" });
  }
};

export { handleSubscription, verifyPayment, getSubscriptionPlans };
