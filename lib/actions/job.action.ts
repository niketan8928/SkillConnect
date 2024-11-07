// // jobs.action.ts

// import Job from "@/database/job.model"; // Adjust the path as needed
// import { JobType } from "./shared.types";
// import { connectToDatabase } from "@/lib/mongoose";

// export const getJobs = async (): Promise<JobType[]> => {
//   try {
//     connectToDatabase();
//     const jobs = await Job.find({});
//     console.log(jobs);
//     return jobs.map((job) => job.toObject()); // Convert Mongoose documents to plain objects
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     throw new Error("Failed to fetch jobs.");
//   }
// };

// export const getJobById = async (id: string): Promise<JobType | null> => {
//   try {
//     const job = await Job.findById(id);
//     return job ? job.toObject() : null;
//   } catch (error) {
//     console.error("Error fetching job:", error);
//     throw new Error("Failed to fetch job.");
//   }
// };

// jobs.action.ts

import Job from "@/database/job.model"; // Adjust the path as needed
import { JobType } from "./shared.types";
import { connectToDatabase } from "@/lib/mongoose";

export const getJobs = async (): Promise<JobType[]> => {
  try {
    await connectToDatabase(); // Ensure the connection is awaited
    const jobs = await Job.find({});
    console.log("Jobs found:", jobs); // This will show data in the console if successful
    return jobs.map((job) => job.toObject()); // Convert Mongoose documents to plain objects
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("Failed to fetch jobs.");
  }
};

export const getJobById = async (id: string): Promise<JobType | null> => {
  try {
    await connectToDatabase();
    const job = await Job.findById(id);
    console.log("Job found:", job); // Log job to verify data retrieval
    return job ? job.toObject() : null;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw new Error("Failed to fetch job.");
  }
};
