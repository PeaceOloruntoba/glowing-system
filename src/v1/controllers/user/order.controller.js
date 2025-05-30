import * as orderService from "../../services/user/order.service.js";
import catchAsync from "../../../utils/catchAsync.js";

export const createOrder = catchAsync(async (req, res) => {
  const { products } = req.body;
  const newOrder = await orderService.createOrder(req.user.userId, products);
  res
    .status(201)
    .json({
      success: true,
      message: "Order created successfully.",
      data: newOrder,
    });
});

export const createOrderFromBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.body;
  const newOrder = await orderService.createOrderFromBooking(bookingId);
  res
    .status(201)
    .json({
      success: true,
      message: "Order created from booking.",
      data: newOrder,
    });
});

export const initiateOrderPayment = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const paymentData = await orderService.initiateOrderPayment(
    orderId,
    req.user.userId
  );
  res.json({ success: true, message: "Payment initiated.", paymentData });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders(req.user.userId);
  res
    .status(200)
    .json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.orderId,
    req.user.userId
  );
  res
    .status(200)
    .json({
      success: true,
      message: "Order retrieved successfully.",
      data: order,
    });
});

export const updateOrder = catchAsync(async (req, res) => {
  const updatedOrder = await orderService.updateOrder(
    req.params.orderId,
    req.body
  );
  res
    .status(200)
    .json({
      success: true,
      message: "Order updated successfully.",
      data: updatedOrder,
    });
});

export const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrder(req.params.orderId, req.user.userId);
  res
    .status(200)
    .json({ success: true, message: "Order deleted successfully." });
});
