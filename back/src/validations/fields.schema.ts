import * as Yup from "yup"

import { emailValidation, passwordValidation } from "../constants/users.constants"

export const emailSchema = Yup.string().trim().matches(emailValidation.value, emailValidation.message).required()

export const passwordSchema = Yup.string().trim().matches(passwordValidation.value, passwordValidation.message).required()


export type passwordSchema = Yup.InferType<typeof passwordSchema>

export type emailSchema = Yup.InferType<typeof emailSchema>


