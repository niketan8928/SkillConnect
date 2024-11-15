import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp />;
}

// import { SignUp } from "@clerk/nextjs";

// export default function Page() {
//   return <SignUp />;
// }

// // Generate static parameters for the dynamic route
// export async function generateStaticParams() {
//   return [
//     // Define your static paths here if you have any
//     // For example, if you want to pre-render a specific path:
//     { signUp: [] }, // for /sign-up
//     // { signUp: ['some-path'] }, // Uncomment this line and add more paths as needed
//   ];
// }
