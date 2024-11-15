"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "@/lib/mongoose";
import { assignBadges } from "@/lib/utils";

import type {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import type { BadgeCriteriaType } from "@/types";

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    // Find the user first
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: Delete user answers, comments, etc

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: { userId: string }) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({
      clerkId: userId,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    // Calculate the number of users to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1, // +1 to check if there is next page
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    const isNext = user.saved.length > pageSize;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });

    // Calculate the number of answers to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNext = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const sendConnectionRequest = async ({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) => {
  try {
    connectToDatabase();
    const fromUser = await User.findOne({ clerkId: fromUserId });
    const toUser = await User.findOne({ clerkId: toUserId });
    if (!fromUser || !toUser) {
      throw new Error("User not found");
    }
    // Check if the request has already been sent
    if (
      fromUser.connectionSent.includes(toUser._id) ||
      toUser.connectionRequests.includes(fromUser._id)
    ) {
      return { success: false, message: "Request already sent" };
    }
    fromUser.connectionSent.push(toUser._id);
    toUser.connectionRequests.push(fromUser._id);
    await fromUser.save();
    await toUser.save();
    return { success: true };
  } catch (error) {
    console.error("Failed to send connection request:", error);
    throw error;
  }
};

export async function acceptConnectionRequest(params: {
  userId: string; // This should be the clerkId of the user
  requesterId: string; // This should be the clerkId of the requester
}) {
  try {
    connectToDatabase();
    const { userId, requesterId } = params;

    // Find the user by their clerkId
    const user = await User.findOne({ clerkId: userId });
    const requester = await User.findOne({ clerkId: requesterId });
    if (!user || !requester) {
      throw new Error("User or requester not found");
    }

    // Update the connection arrays for both users
    await User.updateOne(
      { clerkId: userId },
      {
        $pull: { connectionRequests: requester._id }, // Remove the request from the user's requests list
        $addToSet: { connections: requester._id }, // Add the requester's ObjectId to the user's connections list
      }
    );

    await User.updateOne(
      { clerkId: requesterId },
      {
        $pull: { connectionSent: user._id }, // Remove the user's ObjectId from the requester's connectionSent list
        $addToSet: { connections: user._id }, // Add the user's ObjectId to the requester's connections list
      }
    );

    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function rejectConnectionRequest(params: {
  userId: string; // This should be the clerkId of the user
  requesterId: string; // This should be the clerkId of the requester
}) {
  try {
    connectToDatabase();
    const { userId, requesterId } = params;
    // Find the user and requester by their clerkId
    const user = await User.findOne({ clerkId: userId });
    const requester = await User.findOne({ clerkId: requesterId });
    if (!user || !requester) {
      throw new Error("User or requester not found");
    }
    // Remove the request from the user's connectionRequests list
    await User.updateOne(
      { clerkId: userId },
      {
        $pull: { connectionRequests: requester._id }, // Remove the request from the user's requests list
      }
    );
    // Remove the userId from the requester's connectionSent list
    await User.updateOne(
      { clerkId: requesterId },
      {
        $pull: { connectionSent: user._id }, // Remove the userId from the requester's connectionSent list
      }
    );
    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    // Calculate the number of questions to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
