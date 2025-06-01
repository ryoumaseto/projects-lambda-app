import { NextResponse } from "next/server";
import { WorkoutFormData } from "@/types/workout";
import {
  createWorkoutInDynamoDB,
  getWorkoutsFromDynamoDB,
  updateWorkoutInDynamoDB,
  deleteWorkoutFromDynamoDB,
} from "@/lib/services/dynamodb";

// CORSヘッダーを設定する関数
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

// OPTIONSリクエストに対するハンドラー
export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 200 }));
}

// GETリクエストハンドラー
export async function GET(request: Request) {
  try {
    console.log("GET /api/workouts - Start");
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") as any || "all";
    console.log("Period:", period);

    const workouts = await getWorkoutsFromDynamoDB(period);
    console.log("Workouts fetched:", workouts);

    return setCorsHeaders(NextResponse.json(workouts));
  } catch (error) {
    console.error("GET /api/workouts - Error:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング記録の取得に失敗しました" },
        { status: 500 }
      )
    );
  }
}

// POSTリクエストハンドラー
export async function POST(request: Request) {
  try {
    console.log("POST /api/workouts - Start");
    const data: WorkoutFormData = await request.json();
    console.log("Request data:", data);

    const workout = await createWorkoutInDynamoDB(data);
    console.log("Workout created:", workout);

    return setCorsHeaders(NextResponse.json(workout));
  } catch (error) {
    console.error("POST /api/workouts - Error:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング記録の作成に失敗しました" },
        { status: 500 }
      )
    );
  }
}

// PUTリクエストハンドラー
export async function PUT(request: Request) {
  try {
    console.log("PUT /api/workouts - Start");
    const { workoutId, ...data }: { workoutId: string } & WorkoutFormData =
      await request.json();
    console.log("Request data:", { workoutId, data });

    await updateWorkoutInDynamoDB(workoutId, data);
    return setCorsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("PUT /api/workouts - Error:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング記録の更新に失敗しました" },
        { status: 500 }
      )
    );
  }
}

// DELETEリクエストハンドラー
export async function DELETE(request: Request) {
  try {
    console.log("DELETE /api/workouts - Start");
    const { workoutId } = await request.json();
    console.log("Request data:", { workoutId });

    await deleteWorkoutFromDynamoDB(workoutId);
    return setCorsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("DELETE /api/workouts - Error:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング記録の削除に失敗しました" },
        { status: 500 }
      )
    );
  }
} 