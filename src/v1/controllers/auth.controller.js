import asyncWrapper from "../../middlewares/asyncWrapper.js";
import ApiError from "../../utils/apiError.js";
import authService from "../../v1/services/auth.service.js";

export const register = asyncWrapper(async (req, res, next) => {
  const { fullName, email, password, role, phoneNumber } = req.body;
  console.log(req.body);
  if (!["designer", "user", "admin"].includes(role)) {
    throw ApiError.badRequest('Role must be either "designer" or "user"');
  }
  const result = await authService.register({
    fullName,
    email,
    password,
    role,
    phoneNumber,
  });
  res.status(201).json(result);
});

export const registerDesigner = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const designerData = req.body;

  const result = await authService.registerDesigner(userId, designerData);
  res.status(201).json(result);
});

export const login = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const result = await authService.login(userData);
  res.status(200).json(result);
});

export const getUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await authService.getUser(userId);
  res.status(200).json(result);
});

export const sendOTP = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.sendOTP({ email });
  res.status(200).json(result);
});

export const verifyOTP = asyncWrapper(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP({ email, otp });
  res.status(200).json(result);
});

export const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.forgotPassword({ email });
  res.status(200).json(result);
});

export const resetPassword = asyncWrapper(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const result = await authService.resetPassword({ email, otp, password });
  res.status(200).json(result);
});

// export default { register, login, getUser };
