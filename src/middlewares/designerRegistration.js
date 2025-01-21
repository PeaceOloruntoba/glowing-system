import userProfile from "../v1/models/userProfile.model.js";

export const checkDesignerRegistration = async (req, res, next) => {
  const { userId } = req.user;
  const designerProfile = await userProfile.findOne({ userId });
  if (!designerProfile.roles.includes("designer")) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this feature",
    });
  }
  if (!designerProfile.isDesignerRegistered){
    return res.status(403).json({
      success:false,
      message:"Complete your designer registration to access this feature."
    })
  }
  console.log("Through");
  next();
};
