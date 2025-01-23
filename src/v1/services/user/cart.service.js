import Cart from "../../models/cart.model";

export default {
  createCart: async (user) => {
    const cart = new Cart({ user });
    return await cart.save();
  },

  getCartByUser: async (userId) => {
    return await Cart.findOne({ user: userId }).populate("products.product");
  },

  addItemToCart: async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
  },

  updateCartItemQuantity: async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    cart.products[productIndex].quantity = quantity;

    return await cart.save();
  },

  removeItemFromCart: async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    return await cart.save();
  },
};
