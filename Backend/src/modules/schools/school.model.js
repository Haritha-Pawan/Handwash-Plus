import mongoose from "mongoose";

const {Schema} = mongoose;

const schoolSchema = new Schema(
    {
        schoolRegNo: {
            type: String,
            required: [true, "School registration number is required"],
            unique: true,
            trim: true,
            uppercase: true,
        },

        name: {
            required: [true, "School name is required"],
            trim: true,
        },

        address: {
            type: String,
            city: String,
            province: String,
            postalCode: String,
        },

        contactInfo: {
            phone: String,
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },

        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const School = mongoose.model("School", schoolSchema);

export default School;