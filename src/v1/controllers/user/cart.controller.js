
const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart(req.user._id); // Assuming you have user authentication
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartByUser(req.user._id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.addItemToCart(req.user._id, productId);
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
      req.user._id,
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
    const cart = await cartService.removeItemFromCart(req.user._id, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
