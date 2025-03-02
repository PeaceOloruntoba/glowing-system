import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

const processPaystackPayment = async (bookingId, amount) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: amount * 100, // Convert to kobo
        currency: "NGN",
        reference: `booking-${bookingId}-${Date.now()}`,
        callback_url: `${process.env.BASE_URL}/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing Paystack payment:", error);
    throw new Error("Payment processing failed.");
  }
};

export default processPaystackPayment;
