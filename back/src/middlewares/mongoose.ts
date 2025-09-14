import { CallbackError, Document, Query } from "mongoose"

type MyHookNextFunction = (error?: CallbackError) => void;

export const handleSaveError = (error: CallbackError & { code?: number; keyValue?: Record<string, string>; status?: number }, doc: Document, next: MyHookNextFunction): void => {
    if (error.name === "MongoServerError" && error.code === 11000) {
        error.status = 400

        const field = Object.keys(error.keyValue || {})[0]
        const value = error.keyValue?.[field]

        error.message = `The field ${field} $${value} - value is already created`
    } else {
        error.status = 400;
        error.message = error.message || `Validation error`
    }
    next()
}

export const setUpdateSettings = function (
    this: Query<any, any>,
    next: MyHookNextFunction
): void {
    this.setOptions({ new: true, runValidators: true });
    next();
};