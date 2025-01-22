import ApiError from "../../../utils/apiError.js";
import DesignerProfile from "../../models/designerProfile.model.js";
import UserProfile from "../../models/userProfile.model.js";
import Product from "../../models/product.model.js";

export default {
  getAllDesigners: async function () {
    const result = await DesignerProfile.find();
    // Map over bookings to fetch additional user details
    const designers = await Promise.all(
      result.map(async (designer) => {
        const userProfile = await UserProfile.findOne({
          userId: designer.userId,
        });
        const fullName = userProfile?.fullName;
        const image = userProfile?.image;
        return {
          ...designer.toObject(),
          fullName,
          image,
        };
      })
    );
    return designers;
  },

  getDesignerById: async function (designerId) {
    const result = await DesignerProfile.findById(designerId);
    const userProfile = await UserProfile.findOne({ userId: result.userId });
    const fullName = userProfile?.fullName;
    const phoneNumber = userProfile?.phoneNumber;
    const email = userProfile?.email;
    const image = userProfile?.image;
    const designer = {
      ...result.toObject(),
      fullName,
      email,
      phoneNumber,
      image,
    };
    return designer;
  },
};
