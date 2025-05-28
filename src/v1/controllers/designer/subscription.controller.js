import DesignerProfile from "../../models/designerProfile.model.js";
import PaystackService from "../../services/paystack.service.js";
import ApiError from "../../../utils/apiError.js";
import catchAsync from "../../../utils/catchAsync.js";

export const getSubscriptionPlans = catchAsync(async (req, res) => {
  const plans = await PaystackService.getPlans();
  return res.status(200).json({ success: true, data: plans.data });
});

export const handleSubscription = catchAsync(async (req, res) => {
  const { userId, email } = req.user;
  const { plan } = req.body; // "monthly", "biannual", "annual"

  if (!["monthly", "biannual", "annual"].includes(plan)) {
    throw ApiError.badRequest("Invalid subscription plan");
  }

  const designerProfile = await DesignerProfile.findOne({ userId });
  if (!designerProfile) {
    throw ApiError.notFound("Designer profile not found");
  }

  if (designerProfile.subActive && designerProfile.paystackSubscriptionCode) {
    throw ApiError.badRequest("Subscription already active");
  }

  if (!designerProfile.trialStart) {
    // Start 14-day free trial
    const now = new Date();
    designerProfile.trialStart = now;
    designerProfile.trialEnd = new Date(
      now.getTime() + 14 * 24 * 60 * 60 * 1000
    );
    designerProfile.subscriptionPlan = "trial";
    designerProfile.subActive = true;
    await designerProfile.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "14-day free trial started",
        data: designerProfile,
      });
  }

  const planConfig = {
    monthly: { name: "Monthly Plan", interval: "monthly", amount: 5000 },
    biannual: { name: "Biannual Plan", interval: "biannually", amount: 25000 },
    annual: { name: "Annual Plan", interval: "annually", amount: 50000 },
  };

  // Check if plan exists, create if not
  const plans = await PaystackService.getPlans();
  let paystackPlan = plans.data.find(
    (p) =>
      p.interval === planConfig[plan].interval &&
      p.amount === planConfig[plan].amount * 100
  );
  if (!paystackPlan) {
    paystackPlan = await PaystackService.createPlan(
      planConfig[plan].name,
      planConfig[plan].interval,
      planConfig[plan].amount
    );
  }

  const reference = `SUB_${userId}_${Date.now()}`;
  const paymentData = await PaystackService.initializeTransaction(
    email,
    planConfig[plan].amount,
    reference,
    { userId, plan, planCode: paystackPlan.plan_code }
  );

  designerProfile.subscriptionPlan = plan;
  await designerProfile.save();

  return res.status(200).json({
    success: true,
    message: "Subscription payment initialized",
    authorizationUrl: paymentData.data.authorization_url,
    reference,
  });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.params;
  const paymentData = await PaystackService.verifyTransaction(reference);

  if (paymentData.data.status !== "success") {
    throw ApiError.badRequest("Payment verification failed");
  }

  const { metadata, customer } = paymentData.data;
  const { userId, plan, planCode } = metadata;

  const designerProfile = await DesignerProfile.findOne({ userId });
  if (!designerProfile) {
    throw ApiError.notFound("Designer profile not found");
  }

  const subscriptionData = await PaystackService.createSubscription(
    customer.email,
    planCode
  );
  designerProfile.paystackSubscriptionCode =
    subscriptionData.data.subscription_code;
  designerProfile.paystackCustomerCode = customer.customer_code;
  designerProfile.subActive = true;
  designerProfile.subscriptionExpiry = new Date(
    subscriptionData.data.next_payment_date
  );
  designerProfile.trialStart = null;
  designerProfile.trialEnd = null;
  await designerProfile.save();

  return res
    .status(200)
    .json({
      success: true,
      message: "Subscription activated",
      data: designerProfile,
    });
});
