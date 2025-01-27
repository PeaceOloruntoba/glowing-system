import mongoose from "mongoose";
import { generateToken } from "../../config/token.js";
import User from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";
import DesignerProfile from "../models/designerProfile.model.js";
import OTP from "../models/otp.model.js";
import ApiError from "../../utils/apiError.js";
import { hashPassword, validatePassword } from "../../utils/validationUtils.js";
import emailUtils from "../../utils/emailUtils.js";

export default {
  findUserByEmail: async function (email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound("No user with this email");
    }
    return user;
  },
  findUserProfileByIdOrEmail: async function (identifier) {
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const userProfile = await UserProfile.findOne(
      isObjectId ? { userId: identifier } : { email: identifier }
    );

    if (!userProfile) {
      throw ApiError.notFound("User Not Found");
    }

    return userProfile;
  },
  findDesignerProfileByIdOrEmail: async function (identifier) {
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const designerProfile = await DesignerProfile.findOne(
      isObjectId ? { userId: identifier } : { email: identifier }
    );
    return designerProfile;
  },
  register: async function (userData = {}) {
    const { fullName, email, password, role, phoneNumber } = userData;
    console.log(fullName);
    const hashedPassword = await hashPassword(password);
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await User.create([{ email, password: hashedPassword }], {
        session,
      });
      const userProfile = await UserProfile.create(
        [
          {
            userId: user[0]._id,
            email,
            fullName,
            roles: [role],
            phoneNumber,
          },
        ],
        { session }
      );
      const emailInfo = await emailUtils.sendOTPViaEmail(email, fullName);
      await session.commitTransaction();
      session.endSession();
      return {
        success: true,
        status_code: 201,
        message: `Registration Successful, OTP sent to ${emailInfo.envelope.to}`,
        data: { email, id: user[0]._id },
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
  registerDesigner: async function (userId, designerData) {
    const {
      businessName,
      phoneNumber,
      yearsOfExperience,
      socialMedia,
      cacRegNo,
      businessAddress,
      bank,
      accountNumber,
      state,
    } = designerData;
    const existingProfile = await DesignerProfile.findOne({ userId });
    if (existingProfile) {
      throw ApiError.badRequest("Designer has already completed registration");
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await DesignerProfile.create(
        [
          {
            userId,
            businessName,
            phoneNumber,
            yearsOfExperience,
            socialMedia,
            cacRegNo,
            businessAddress,
            bank,
            accountNumber,
            state,
          },
        ],
        { session }
      );
      await UserProfile.findOneAndUpdate(
        { userId },
        { isDesignerRegistered: true },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return {
        success: true,
        message: "Designer registration completed successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
  login: async function (userData = {}) {
    const { email, password } = userData;
    const user = await this.findUserByEmail(email);
    await validatePassword(password, user.password);
    const userProfile = await this.findUserProfileByIdOrEmail(user._id);

    if (!userProfile.isVerified) {
      throw ApiError.forbidden("Email Not Verified");
    }
    const token = generateToken(user._id);
    return {
      success: true,
      status_code: 200,
      message: "Login Successful",
      data: {
        user: {
          email: user.email,
          id: user._id,
          roles: userProfile.roles,
          isDesignerRegistered: userProfile.isDesignerRegistered,
        },
        token,
      },
    };
  },
  getUser: async function (userId, roles) {
    const userProfile = await this.findUserProfileByIdOrEmail(userId);
    const designerProfile = await this.findDesignerProfileByIdOrEmail(userId);
    return {
      success: true,
      status_code: 200,
      message: "User Retrieved Successfully",
      data: {
        user: {
          id: userProfile.userId,
          businessName: designerProfile?.businessName,
          businessAddress: designerProfile?.businessAddress,
          state: designerProfile?.state,
          fullName: userProfile.fullName,
          email: userProfile.email,
          phoneNumber: userProfile.phoneNumber,
        },
      },
    };
  },
  getDesignerProfile: async function (userId) {
    const designerProfile = await DesignerProfile.findOne({ userId });
    if (!designerProfile) {
      throw ApiError.notFound("Designer profile not found");
    }
    return {
      success: true,
      status_code: 200,
      message: "Designer profile retrieved successfully",
      data: {
        user: {
          id: designerProfile.userId,
          businessName: designerProfile.businessName,
          phoneNumber: designerProfile.phoneNumber,
          yearsOfExperience: designerProfile.yearsOfExperience,
          businessAddress: designerProfile.businessAddress,
          bank: designerProfile.bank,
          accountNumber: designerProfile.accountNumber,
        },
      },
    };
  },
  sendOTP: async function ({ email }) {
    const userProfile = await this.findUserProfileByIdOrEmail(email);
    if (userProfile.isVerified) {
      return {
        success: true,
        status_code: 200,
        message: "User Already Verified",
      };
    }
    const emailInfo = await emailUtils.sendOTPViaEmail(
      userProfile.email,
      userProfile.firstName
    );
    return {
      success: true,
      status_code: 200,
      message: `OTP has been sent to ${emailInfo.envelope.to}`,
    };
  },
  verifyOTP: async function ({ email, otp }) {
    const userProfile = await this.findUserProfileByIdOrEmail(email);
    if (userProfile.isVerified) {
      return {
        success: true,
        status_code: 200,
        message: "User Already Verified",
      };
    }
    const otpExists = await OTP.findOne({ email, otp });
    if (!otpExists) {
      throw ApiError.badRequest("Invalid or Expired OTP");
    }
    userProfile.isVerified = true;
    await userProfile.save();
    return {
      success: true,
      status_code: 200,
      message: "Email Verified",
    };
  },
  forgotPassword: async function ({ email }) {
    const userProfile = await this.findUserProfileByIdOrEmail(email);
    const emailInfo = await emailUtils.sendOTPViaEmail(
      userProfile.email,
      userProfile.firstName
    );
    return {
      success: true,
      status_code: 200,
      message: `OTP has been sent to ${emailInfo.envelope.to}`,
    };
  },
  resetPassword: async function ({ email, otp, password }) {
    const user = await this.findUserByEmail(email);
    const hashedPassword = await hashPassword(password);
    const otpExists = await OTP.findOne({ email, otp });
    if (!otpExists) {
      throw ApiError.badRequest("Invalid or Expired OTP");
    }
    user.password = hashedPassword;
    await user.save();
    return {
      success: true,
      status_code: 200,
      message: "Password Updated",
    };
  },
};
