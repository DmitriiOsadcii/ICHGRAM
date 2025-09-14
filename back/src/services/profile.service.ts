import User from "../db/models/User";
import cloudinary from "../utils/cloudinary";
import HttpExeption from "../utils/HttpExeption";

import { UserDocument, PublicUserResponse } from "../db/models/User";
import publicUser from "../utils/userJs";
import { IUpdateUser } from "../typescript/interfaces";
import { unlink } from "fs/promises";

export const getProfile = async ({ _id }: UserDocument): Promise<PublicUserResponse> => {
    const user: UserDocument | null = await User.findById(_id)
    if (!user) throw HttpExeption(401, `User with ${_id} is not found`)

    const result = publicUser(user)
    return result
}

export const updateProfile = async ({ payload, file }: IUpdateUser, { _id }: UserDocument): Promise<PublicUserResponse> => {
    const user: UserDocument | null = await User.findById(_id)
    if (!user) throw HttpExeption(401, `User with id ${_id} is not found`)

    if (file) {
        const { url: image } = await cloudinary.uploader.upload(file.path, {
            folder: "ichgram",
            use_filename: true
        });
        await unlink(file.path)
        user.profilePhoto = image
    }
    const { fullName, username, biography, website } = payload;

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (biography !== undefined) user.biography = biography;
    if (website !== undefined) user.website = website;

    await user.save()

    const result = publicUser(user)
    return result;
}