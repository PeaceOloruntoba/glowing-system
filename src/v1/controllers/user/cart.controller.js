import cartService from "../../services/user/cart.service";

const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart(req.user.userId);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartByUser(req.user.userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.addItemToCart(req.user.userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(
      req.user.userId,
      productId,
      quantity
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItemFromCart(req.user.userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
