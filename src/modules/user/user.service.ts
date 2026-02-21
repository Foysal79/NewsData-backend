import jwt from "jsonwebtoken";



import { User } from "./user.model";
import config from "../../config";
import IUser from "./user.interface";

const signToken = (payload: object) =>
  jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.jwtExpiresIn });

export const userService = {
  register: async (payload: IUser) => {
    const exists = await User.findOne({ email: payload.email });
    if (exists) throw new AppError(409, "Email already registered");

    const user = await User.create(payload);
    const token = signToken({ userId: user._id, email: user.email });

    return { user: { id: user._id, email: user.email }, token };
  },

  login: async (payload: IUser) => {
    const user = await User.findOne({ email: payload.email }).select(
      "+password",
    );
    if (!user) throw new AppError(401, "Invalid credentials");

    const ok = await user.comparePassword(payload.password);
    if (!ok) throw new AppError(401, "Invalid credentials");

    const token = signToken({ userId: user._id, email: user.email });
    return { user: { id: user._id, email: user.email }, token };
  },
};
