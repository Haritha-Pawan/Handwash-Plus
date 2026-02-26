import mongoose from "mongoose";

const { Schema } = mongoose;

const gradeSchema = new Schema(
    {
        gradeNumber: {
            type: Number,
            required: [true, "Grade number is required"],
            min: [1, "Grade number must be at least 1"],
            max: [13, "Grade number must be at most 13"],
        },

        school: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: [true, "Grade must belong to a school"],
            index: true,
        },

        classTeacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        studentCount: {
            type: Number,
            default: 0,
            min: [0, "Student count cannot be negative"],
        },

        sanitizer: {

            currentQuantity: {
                type: Number,
                default: 0,
                min: [0, "Current quantity cannot be negative"],
            },

            unit: {
                type: String,
                enum: ["liters", "ml"],
                default: "ml",
            },

            lowThreshold: {
                type: Number,
                default: 100,
            },

            lastUpdatedBy: {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            lastUpdatedAt: {
                type: Date,
                default: null,
            },
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

gradeSchema.virtual("gradeName").get(function () {
    return `Grade ${this.gradeNumber}`;
});

gradeSchema.virtual("sanitizer.status").get(function () {
    const quantity = this.sanitizer?.currentQuantity ?? 0;
    const threshold = this.sanitizer?.lowThreshold ?? 100;

    if (quantity <= 0) return "empty";
    if (quantity <= threshold * 0.5) return "critical";
    if (quantity <= threshold) return "low";
    return "adequate";
});

gradeSchema.index({ school: 1, gradeNumber: 1 }, { unique: true });

gradeSchema.index({ school: 1, isActive: 1 });

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;

