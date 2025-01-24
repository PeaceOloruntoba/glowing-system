import cartService from "../../services/user/cart.service";

export const createCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await cartService.createCart(userId);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cart" });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await cartService.getCartByUser(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
};

export const addItemToCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { productId } = req.params;
    const cart = await cartService.addItemToCart(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(
      userId,
      productId,
      quantity
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItemFromCart(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
