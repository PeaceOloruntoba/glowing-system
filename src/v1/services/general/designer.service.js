import ApiError from "../../../utils/apiError.js";
import DesignerProfile from "../../models/designerProfile.model.js";
import Product from "../../models/product.model.js";

export default {
  getAllDesigners: async function () {
    const designers = await DesignerProfile.findOne()
    return designers;
  },

  getDesignerById: async function (designerId) {
    const designer = await DesignerProfile.findById(designerId);
    if (!designer) {
      throw ApiError.notFound("Designer not found");
    }
    return designer;
  },
};
