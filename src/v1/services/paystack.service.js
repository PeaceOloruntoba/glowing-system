import axios from "axios";
import ApiError from "../../utils/apiError.js";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystack = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

class PaystackService {
  static async initializeTransaction(email, amount, reference, metadata = {}) {
    try {
      const response = await paystack.post("/transaction/initialize", {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Paystack initialization failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async verifyTransaction(reference) {
    try {
      const response = await paystack.get(`/transaction/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Paystack verification failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async createPlan(name, interval, amount) {
    try {
      const response = await paystack.post("/plan", {
        name,
        interval,
        amount: amount * 100, // Convert to kobo
        currency: "NGN",
      });
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Paystack plan creation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async getPlans() {
    try {
      const response = await paystack.get("/plan");
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Paystack plan fetch failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async createSubscription(customerEmail, planCode) {
    try {
      const response = await paystack.post("/subscription", {
        customer: customerEmail,
        plan: planCode,
      });
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Paystack subscription creation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async disableSubscription(subscriptionCode) {
    try {
      const response = await paystack.post("/subscription/disable", {
        code: subscriptionCode,
      });
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Paystack subscription disable failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}

export default PaystackService;
