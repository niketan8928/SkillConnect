// job.tsx
import { JobType } from "@/lib/actions/shared.types";
import { getJobs } from "@/lib/actions/job.action";

const JobsPage = async () => {
  const jobs: JobType[] = await getJobs();

  return (
    // <div>
    //   <h1>Job Listings</h1>
    //   {jobs.map((job) => (
    //     <div key={job._id}>
    //       <h1>
    //         <strong>{job.location}</strong>
    //       </h1>
    //       <p>
    //         <strong>Remote:</strong> {String(job.remote)}
    //       </p>
    //       <p>
    //         <strong>Wage:</strong> {String(job.wage)}
    //       </p>
    //       <p>
    //         <strong>Skills:</strong> {String(job.skills)}
    //       </p>
    //     </div>
    //   ))}
    // </div>
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f7f8fa",
        maxWidth: "800px",
        margin: "auto",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          color: "#333",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Job Listings
      </h1>
      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            backgroundColor: "#ffffff",
            margin: "15px 0",
            padding: "15px",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "20px", color: "#0073e6", margin: "0" }}>
            <strong>{job.location}</strong>
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#555",
              margin: "5px 0",
              lineHeight: "1.4",
            }}
          >
            <strong style={{ color: "#333" }}>Remote:</strong>{" "}
            {String(job.remote)}
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#555",
              margin: "5px 0",
              lineHeight: "1.4",
            }}
          >
            <strong style={{ color: "#333" }}>Wage:</strong> {String(job.wage)}
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#555",
              margin: "5px 0",
              lineHeight: "1.4",
            }}
          >
            <strong style={{ color: "#333" }}>Skills:</strong>{" "}
            {String(job.skills)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default JobsPage;
