import mongoose from "mongoose";
import 'dotenv'

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.DB_CONNCTION_STRING)
        console.log('successfully make the db connction')
    } catch (error) {
        console.log('error on db connction')
    }
}

export default dbConnection