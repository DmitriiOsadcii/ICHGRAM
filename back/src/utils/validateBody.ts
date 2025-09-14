import { HttpError } from "../typescript/classes"
import { Validate } from "../typescript/interfaces"

const validateBody = async <K extends Validate<T>, T>(schema: K, body: T)
    : Promise<boolean> => {
    try {
        await schema.validate(body, { abortEarly: false, strict: true })
        return true
    } catch (error) {
        if (error instanceof Error) {
            (error as HttpError).status = 400
        }
        throw error
    }
}
export default validateBody;