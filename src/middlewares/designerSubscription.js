import DesignerProfile from "../v1/models/designerProfile.model";

const checkSubscription = async (req, res, next) => {
  try {
    if (req.user.roles.includes("designer")) {
      const designerProfile = await DesignerProfile.findOne({
        userId: req.user.id,
      });

      if (!designerProfile || !designerProfile.subActive) {
        return res.status(403).json({ message: "Subscription required" });
      }
    }
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default checkSubscription;
