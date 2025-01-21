import designerService from "../../services/general/designer.service.js";

export const getDesigners = async function (req, res, next) {
  try {
    const designers = await designerService.getAllDesigners();
    res.status(200).json({ success: true, data: designers });
  } catch (error) {
    next(error);
  }
};

export const getDesignerById = async function (req, res, next) {
  try {
    const designerId = req.params.designerId;
    const designer = await designerService.getDesignerById(designerId);
    res.status(200).json({ success: true, data: designer });
  } catch (error) {
    next(error);
  }
};
