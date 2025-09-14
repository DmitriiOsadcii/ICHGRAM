import mongoose from "mongoose";

const { DATABASE_URI } = process.env

const connectDatabase = async (): Promise<void> => {
    try {
        if (typeof DATABASE_URI !== "string") throw Error("DATABASE_URI environment variable is not defined")
        await mongoose.connect(DATABASE_URI)
        console.log(`Successfully connected to database`);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error connect to database failed due to ${error.message}`);
        }
        throw error;
    }
}

export default connectDatabase;