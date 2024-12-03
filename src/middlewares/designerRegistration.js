import userProfile from "../v1/models/userProfile.model";

export const checkDesignerRegistration = async (req, res, next) => {
  const { userId } = req.user;
  const designerProfile = await userProfile.findOne({ userId });
  if (
    designerProfile.roles.includes("designer") &&
    !designerProfile.isDesignerRegistered
  ) {
    return res.status(403).json({
      success: false,
      message: "Complete your designer registration to access this feature",
    });
  }
  next();
};
