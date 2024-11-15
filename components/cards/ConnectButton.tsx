"use client";

import { useState } from "react";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "@/lib/actions/user.action";

interface ConnectButtonProps {
  userId: string;
  currentUserId: string | null;
  isConnectedUser: boolean;
  isConnectingUser: boolean;
  hasReceivedRequest: boolean;
}

const ConnectButton = ({
  userId,
  currentUserId,
  isConnectedUser,
  isConnectingUser,
  hasReceivedRequest,
}: ConnectButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(isConnectingUser);
  const [isConnected, setIsConnected] = useState(isConnectedUser);
  const [hasRequest, setHasRequest] = useState(hasReceivedRequest);

  const handleConnect = async () => {
    if (
      !currentUserId ||
      userId === currentUserId ||
      isConnecting ||
      isConnected ||
      hasRequest
    )
      return;

    setIsConnecting(true);
    try {
      await sendConnectionRequest({
        fromUserId: currentUserId,
        toUserId: userId,
      });
      setIsConnecting(true);
    } catch (error) {
      console.error("Failed to send connection request:", error);
      setIsConnecting(false);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptConnectionRequest({
        userId: currentUserId!,
        requesterId: userId,
      });
      setIsConnected(true);
      setHasRequest(false); // Hide the request buttons after accepting
    } catch (error) {
      console.error("Failed to accept connection request:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectConnectionRequest({
        userId: currentUserId!,
        requesterId: userId,
      });
      setHasRequest(false); // Hide the request buttons after rejecting
    } catch (error) {
      console.error("Failed to reject connection request:", error);
    }
  };

  if (!currentUserId || userId === currentUserId) return null;

  if (hasRequest) {
    return (
      <div>
        <button
          onClick={handleAccept}
          className="primary-gradient mt-2 flex items-center justify-center gap-2 rounded-lg p-2 text-white"
        >
          Accept Request
        </button>
        <button
          onClick={handleReject}
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
        >
          Reject Request
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || isConnected}
      className="primary-gradient mt-2 flex items-center justify-start gap-4 rounded-lg bg-transparent p-3 text-light-900"
    >
      {isConnecting ? "Request Sent" : isConnected ? "Connected" : "Connect"}
    </button>
  );
};

export default ConnectButton;
