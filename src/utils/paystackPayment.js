import axios from "axios";

const processPaystackPayment = async ({ email, amount, reference }) => {
  console.log(email);
  console.log(amount);
  console.log(reference);
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert amount to kobo (Paystack uses kobo)
        reference, // Unique transaction reference
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", response.data); // Log response to debug

    if (!response.data.status) {
      throw new Error(
        `Payment initialization failed: ${response.data.message}`
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Paystack Payment Error:",
      error.response?.data || error.message
    );
    throw new Error("Payment processing failed.");
  }
};

export default processPaystackPayment;
