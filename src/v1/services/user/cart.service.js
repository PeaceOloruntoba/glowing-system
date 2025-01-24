import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import ApiError from "../../../utils/apiError.js";

export default {
  // Get cart for a user
  getCart: async function (userId) {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "productName description coverImage",
    });

    if (!cart) {
      return { items: [], totalAmount: 0 };
    }

    // Format the cart to include product details directly
    const formattedItems = cart.items.map((item) => ({
      productId: item.productId._id,
      productName: item.productId.productName,
      description: item.productId.description,
      coverImage: item.productId.coverImage,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    return {
      items: formattedItems,
      totalAmount: cart.totalAmount,
    };
  },

  // Add product to cart
  addToCart: async function (userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        totalPrice: product.ourPrice * quantity,
      });
    }

    await cart.save();
    return cart;
  },

  // Increment product quantity
  incrementQuantity: async function (userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw ApiError.notFound("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      throw ApiError.notFound("Product not in cart");
    }

    item.quantity += 1;
    await cart.save();
    return cart;
  },

  // Decrement product quantity
  decrementQuantity: async function (userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw ApiError.notFound("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      throw ApiError.notFound("Product not in cart");
    }

    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    await cart.save();
    return cart;
  },

  // Remove product from cart
  removeFromCart: async function (userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw ApiError.notFound("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    return cart;
  },
};
