import cron from "node-cron";
import DesignerProfile from "../v1/models/designerProfile.model";

const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    // Find designers with expired subscriptions
    const expiredSubscriptions = await DesignerProfile.find({
      subscriptionExpiry: { $lt: now },
      subActive: true,
    });

    if (expiredSubscriptions.length > 0) {
      // Update the subActive field to false
      await DesignerProfile.updateMany(
        { _id: { $in: expiredSubscriptions.map((designer) => designer._id) } },
        { subActive: false }
      );

      console.log(
        `Updated ${expiredSubscriptions.length} expired subscriptions.`
      );
    } else {
      console.log("No expired subscriptions to update.");
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
};

// Schedule the cron job to run daily at midnight (00:00)
cron.schedule("0 0 * * *", checkExpiredSubscriptions);

console.log("Subscription expiry check cron job started.");
