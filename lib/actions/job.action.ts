import Job from "@/database/job.model";
import { JobType } from "./shared.types";
import { connectToDatabase } from "@/lib/mongoose";

export const getJobs = async (): Promise<JobType[]> => {
  try {
    await connectToDatabase();
    const jobs = await Job.find({});
    console.log("Jobs found:", jobs);
    return jobs.map((job) => job.toObject());
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs.");
  }
};

export const getJobById = async (id: string): Promise<JobType | null> => {
  try {
    await connectToDatabase();
    const job = await Job.findById(id);
    console.log("Job found:", job);
    return job ? job.toObject() : null;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw new Error("Failed to fetch job.");
  }
};
