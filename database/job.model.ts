import { Schema, models, model, Document } from "mongoose";

export interface IJob extends Document {
  location?: string;
  remote?: boolean | string;
  wage?: boolean | string;
  skills?: boolean | string;
}

const JobSchema = new Schema({
  location: { type: String, required: false },
  remote: { type: Schema.Types.Mixed, required: false },
  wage: { type: Schema.Types.Mixed, required: false },
  skills: { type: Schema.Types.Mixed, required: false },
});

const Job = models.Job || model<IJob>("Job", JobSchema);

export default Job;
