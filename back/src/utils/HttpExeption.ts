import { StatusCode } from "../typescript/type";
import { HttpError } from "../typescript/classes";

const initialState = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Server error",
};

const HttpExeption = (status: StatusCode, message = initialState[status]): HttpError => {
    const error = new HttpError(message)
    error.status = status
    return error
};

export default HttpExeption;