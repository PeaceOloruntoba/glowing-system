import cron from "node-cron";
import DesignerProfile from "../v1/models/designerProfile.model.js";
import PaystackService from "../v1/services/paystack.service.js";

const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    // Check trial expirations
    const expiredTrials = await DesignerProfile.find({
      trialEnd: { $lt: now },
      subActive: true,
      subscriptionPlan: "trial",
    });

    if (expiredTrials.length > 0) {
      await DesignerProfile.updateMany(
        { _id: { $in: expiredTrials.map((d) => d._id) } },
        {
          subActive: false,
          subscriptionPlan: null,
          trialStart: null,
          trialEnd: null,
        }
      );
      console.log(`Deactivated ${expiredTrials.length} expired trials.`);
    }

    // Check subscription expirations
    const expiredSubscriptions = await DesignerProfile.find({
      subscriptionExpiry: { $lt: now },
      subActive: true,
      subscriptionPlan: { $ne: "trial" },
    });

    for (const designer of expiredSubscriptions) {
      if (designer.paystackSubscriptionCode) {
        await PaystackService.disableSubscription(
          designer.paystackSubscriptionCode
        );
      }
      designer.subActive = false;
      designer.subscriptionPlan = null;
      designer.subscriptionExpiry = null;
      await designer.save();
    }

    if (expiredSubscriptions.length > 0) {
      console.log(
        `Deactivated ${expiredSubscriptions.length} expired subscriptions.`
      );
    } else {
      console.log("No expired subscriptions to update.");
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
};

// Run daily at midnight
cron.schedule("0 0 * * *", checkExpiredSubscriptions);

console.log("Subscription and trial expiry check cron job started.");
