// import Link from "next/link";
// import Image from "next/image";
// import { getTopInteractedTags } from "@/lib/actions/tag.action";
// import { Badge } from "@/components/ui/badge";
// import RenderTag from "@/components/shared/RenderTag";
// import ConnectButton from "./ConnectButton";
// import { IUser } from "@/database/user.model";
// import mongoose from "mongoose";

// interface UserCardProps {
//   user: {
//     _id: string;
//     clerkId: string;
//     picture: string;
//     name: string;
//     username: string;
//   };
//   currentUser: IUser;
// }

// const UserCard = async ({ user, currentUser }: UserCardProps) => {
//   const interactedTags = await getTopInteractedTags({
//     userId: user._id,
//   });

//   function isConnected(id: string) {
//     const objectId = new mongoose.Types.ObjectId(id);
//     const connected = currentUser.connections!.some((connId) =>
//       connId.equals(objectId)
//     );
//     return connected;
//   }

//   function isConnecting(id: string) {
//     const objectId = new mongoose.Types.ObjectId(id);
//     const connecting = currentUser.connectionSent!.some((connId) =>
//       connId.equals(objectId)
//     );
//     return connecting;
//   }

//   function hasReceivedRequest(id: string) {
//     const objectId = new mongoose.Types.ObjectId(id);
//     const receivedRequest = currentUser.connectionRequests!.some((connId) =>
//       connId.equals(objectId)
//     );
//     return receivedRequest;
//   }

//   return (
//     <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
//       <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
//         <Link href={`/profile/${user.clerkId}`}>
//           <Image
//             src={user.picture}
//             alt="User profile picture"
//             width={100}
//             height={100}
//             className="rounded-full"
//           />
//           <div className="mt-4 text-center">
//             <h3 className="h3-bold text-dark200_light900 line-clamp-1">
//               {user.name}
//             </h3>
//             <p className="body-regular text-dark500_light500 mt-2">
//               @{user.username}
//             </p>
//           </div>
//         </Link>

//         <div className="mt-5">
//           {interactedTags.length > 0 ? (
//             <div className="flex items-center gap-2">
//               {interactedTags.map((tag: any) => (
//                 <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
//               ))}
//             </div>
//           ) : (
//             <Badge>No tags yet</Badge>
//           )}
//           <ConnectButton
//             userId={user.clerkId}
//             currentUserId={currentUser.clerkId}
//             isConnectingUser={isConnecting(user._id)}
//             isConnectedUser={isConnected(user._id)}
//             hasReceivedRequest={hasReceivedRequest(user._id)}
//           />
//         </div>
//       </article>
//     </div>
//   );
// };

// export default UserCard;

import Link from "next/link";
import Image from "next/image";

import { getTopInteractedTags } from "@/lib/actions/tag.action";

import { Badge } from "@/components/ui/badge";
import RenderTag from "@/components/shared/RenderTag";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({
    userId: user._id,
  });

  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="User profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag: any) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
