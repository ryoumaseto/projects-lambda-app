import { NextResponse } from "next/server";
import { getWorkoutsFromDynamoDB } from "@/lib/services/dynamodb";
import { WorkoutPeriod } from "@/types/workout";

// CORSヘッダーを設定する関数
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
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
    console.log("GET /api/history - Start");
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") as WorkoutPeriod || "all";
    const presetId = searchParams.get("presetId") || undefined;
    console.log("Period:", period, "PresetId:", presetId);

    const workouts = await getWorkoutsFromDynamoDB(period);
    
    // プリセットIDでフィルタリング
    const filteredWorkouts = presetId
      ? workouts.filter(workout =>
          workout.exercises.some(exercise => exercise.presetId === presetId)
        )
      : workouts;

    // 日付でソート
    const sortedWorkouts = filteredWorkouts.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // プリセットごとのデータを集計
    const historyData = sortedWorkouts.flatMap(workout => {
      return workout.exercises.map(exercise => ({
        date: workout.date,
        presetId: exercise.presetId,
        presetName: exercise.name,
        sets: exercise.sets.map((set, index) => ({
          setNumber: index + 1,
          weight: set.weight,
          reps: set.reps,
        })),
      }));
    });

    return setCorsHeaders(NextResponse.json(historyData));
  } catch (error) {
    console.error("GET /api/history - Error:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング履歴の取得に失敗しました" },
        { status: 500 }
      )
    );
  }
} 