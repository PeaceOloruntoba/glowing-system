import cartService from "../../services/general/cart.service.js";

export const getCart = async function (req, res, next) {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async function (req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const incrementQuantity = async function (req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const cart = await cartService.incrementQuantity(userId, productId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const decrementQuantity = async function (req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const cart = await cartService.decrementQuantity(userId, productId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async function (req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(userId, productId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
