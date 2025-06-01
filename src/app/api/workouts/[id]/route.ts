import { NextResponse } from "next/server";
import { getWorkoutFromDynamoDB, deleteWorkoutFromDynamoDB } from "@/lib/services/dynamodb";

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export async function OPTIONS() {
  return setCorsHeaders(new NextResponse(null, { status: 200 }));
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const workout = await getWorkoutFromDynamoDB(params.id);
    if (!workout) {
      return setCorsHeaders(
        NextResponse.json(
          { error: "トレーニング記録が見つかりませんでした" },
          { status: 404 }
        )
      );
    }
    return setCorsHeaders(NextResponse.json(workout));
  } catch (error) {
    console.error("トレーニング記録の取得に失敗しました:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング記録の取得に失敗しました" },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Deleting workout:", params.id);
    await deleteWorkoutFromDynamoDB(params.id);
    return setCorsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("トレーニング記録の削除に失敗しました:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "トレーニング記録の削除に失敗しました" },
        { status: 500 }
      )
    );
  }
} 