import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { updateLeaderboard } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset Stats
    user.currentScore = 0;
    user.currentStreak = 0;
    user.momentum = 0;
    user.currentDifficulty = 1;

    // Clear Histories
    user.streakQuestionIds = [];
    user.usedQuestionIds = [];

    // Update Version
    user.stateVersion = (user.stateVersion || 0) + 1;

    await user.save();

    try {
      // Force the Redis leaderboard to see "0" for this user
      await updateLeaderboard(user._id.toString(), user.username, 0, 0);
    } catch (err) {
      console.error("Redis cleanup failed:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Stats reset successfully.",
    });
  } catch (error) {
    console.error("Reset API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
