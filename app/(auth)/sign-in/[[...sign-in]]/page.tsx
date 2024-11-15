import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn />;
}

// import { SignIn } from "@clerk/nextjs";

// export default function Page() {
//   return <SignIn />;
// }

// // Generate static parameters for the dynamic route
// export async function generateStaticParams() {
//   return [
//     // Define your static paths here if you have any
//     // For example, if you want to pre-render a specific path:
//     { signIn: [] }, // for /sign-in
//     // { signIn: ['some-path'] }, // Uncomment this line and add more paths as needed
//   ];
// }
