import Paystack from "paystack-api";
import DesignerProfile from "./models/DesignerProfile.js";

const paystack = Paystack(process.env.PAYSTACK_SECRET);

const handleSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { plan } = req.body;
    let amount;

    switch (plan) {
      case "monthly":
        amount = 5000 * 100;
        break;
      case "biannual":
        amount = 27500 * 100;
        break;
      case "annual":
        amount = 55000 * 100;
        break;
      default:
        return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const transaction = await paystack.transaction.initialize({
      email: req.user.email,
      amount: amount,
      metadata: {
        userId: userId,
        plan: plan,
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
      const { userId, plan } = metadata;

      let expiryDate;
      const now = new Date();

      switch (plan) {
        case "monthly":
          expiryDate = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case "biannual":
          expiryDate = new Date(now.setMonth(now.getMonth() + 6));
          break;
        case "annual":
          expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
        default:
          return res.status(400).json({ message: "Invalid plan" });
      }

      await DesignerProfile.findOneAndUpdate(
        { userId: userId },
        {
          subscriptionPlan: plan,
          subscriptionExpiry: expiryDate,
          subActive: true,
        }
      );

      res.status(200).json({ message: "Payment successful" });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

export { handleSubscription, verifyPayment };
