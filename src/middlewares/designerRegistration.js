export const checkDesignerRegistration = async (req, res, next) => {
  const { userId } = req.user;
  const userProfile = await UserProfile.findOne({ userId });
  if (
    userProfile.roles.includes("designer") &&
    !userProfile.isDesignerRegistered
  ) {
    return res.status(403).json({
      success: false,
      message: "Complete your designer registration to access this feature",
    });
  }
  next();
};
