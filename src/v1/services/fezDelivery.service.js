import axios from "axios";
import ApiError from "../../utils/apiError.js";

const FEZ_DELIVERY_BASE_URL = "https://api.fezdelivery.co";
const FEZ_DELIVERY_API_KEY = process.env.FEZ_DELIVERY_API_KEY;

const fezDelivery = axios.create({
  baseURL: FEZ_DELIVERY_BASE_URL,
  headers: {
    Authorization: `Bearer ${FEZ_DELIVERY_API_KEY}`,
    "Content-Type": "application/json",
  },
});

class FezDeliveryService {
  static async calculateShippingCost(
    pickupAddress,
    deliveryAddress,
    packageDetails
  ) {
    try {
      const response = await fezDelivery.post("/v1/quote", {
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        package_details: packageDetails,
      });
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Fez Delivery quote failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async bookDelivery(
    orderId,
    pickupAddress,
    deliveryAddress,
    packageDetails,
    customerDetails
  ) {
    try {
      const response = await fezDelivery.post("/v1/delivery", {
        order_id: orderId,
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        package_details: packageDetails,
        customer_details: customerDetails,
      });
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Fez Delivery booking failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  static async trackDelivery(deliveryId) {
    try {
      const response = await fezDelivery.get(
        `/v1/delivery/${deliveryId}/track`
      );
      return response.data;
    } catch (error) {
      throw ApiError.internalServerError(
        `Fez Delivery tracking failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}

export default FezDeliveryService;
