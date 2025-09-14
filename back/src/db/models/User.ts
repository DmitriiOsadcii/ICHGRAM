import { Schema, model, Document, Types } from "mongoose";

import { emailValidation } from "../../constants/users.constants";

import { Iuser } from "../../typescript/interfaces";
import { handleSaveError, setUpdateSettings } from "../../middlewares/mongoose";

export type UserDocument = Iuser & Document<Types.ObjectId>
export type PublicUserResponse = Omit<Iuser, "password" | "token" | "refreshToken" | "verificationCode"> & { _id: string }

const UserSchema = new Schema<Iuser>({
    email: {
        type: String,
        unique: true,
        match: emailValidation.value,
        required: true
    },
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    biography: {
        type: String,
    },
    website: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    verificationCode: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { versionKey: false, timestamps: true });

UserSchema.post("save", handleSaveError)
UserSchema.pre("findOneAndUpdate", setUpdateSettings)
UserSchema.post("findOneAndUpdate", handleSaveError)

const User = model<Iuser>("user", UserSchema);

export default User;