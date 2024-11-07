// job.tsx

// ./app/(root)/jobs/page.tsx

import { JobType } from "@/lib/actions/shared.types";
import { getJobs } from "@/lib/actions/job.action"; // Adjust the path if needed

const JobsPage = async () => {
  const jobs: JobType[] = await getJobs();

  return (
    <div>
      <h1>Job Listings</h1>
      {jobs.map((job) => (
        <div key={job._id}>
          <h1>
            <strong>{job.location}</strong>
          </h1>
          <p>
            <strong>Remote:</strong> {String(job.remote)}
          </p>
          <p>
            <strong>Wage:</strong> {String(job.wage)}
          </p>
          <p>
            <strong>Skills:</strong> {String(job.skills)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default JobsPage;
