import mongoose from "mongoose";

const publicSubmissionSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["blood_donation"],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

const PublicSubmission = mongoose.model("PublicSubmission", publicSubmissionSchema);
export default PublicSubmission;
