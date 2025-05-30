import crypto from "crypto";
import DesignerProfile from "../models/designerProfile.model.js";
import ApiError from "../../utils/apiError.js";
import catchAsync from "../../utils/catchAsync.js";

export const handleWebhook = catchAsync(async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    throw ApiError.unauthorized("Invalid webhook signature");
  }

  const event = req.body;
  if (event.event === "subscription.create") {
    const { customer, subscription_code, next_payment_date } = event.data;
    await DesignerProfile.findOneAndUpdate(
      { paystackCustomerCode: customer.customer_code },
      {
        paystackSubscriptionCode: subscription_code,
        subscriptionExpiry: new Date(next_payment_date),
        subActive: true,
      }
    );
  } else if (
    event.event === "subscription.disable" ||
    event.event === "subscription.not_renew"
  ) {
    await DesignerProfile.findOneAndUpdate(
      { paystackSubscriptionCode: event.data.subscription_code },
      { subActive: false, subscriptionExpiry: null }
    );
  }

  return res.status(200).json({ success: true, message: "Webhook processed" });
});
