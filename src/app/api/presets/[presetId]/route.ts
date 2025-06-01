import { NextResponse } from "next/server";
import { PresetFormData } from "@/types/preset";
import {
  updatePresetInDynamoDB,
  deletePresetFromDynamoDB,
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

// PUTリクエストハンドラー
export async function PUT(
  request: Request,
  { params }: { params: { presetId: string } }
) {
  try {
    const data: PresetFormData = await request.json();
    await updatePresetInDynamoDB(params.presetId, data);
    return setCorsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("プリセットの更新に失敗しました:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "プリセットの更新に失敗しました" },
        { status: 500 }
      )
    );
  }
}

// DELETEリクエストハンドラー
export async function DELETE(
  request: Request,
  { params }: { params: { presetId: string } }
) {
  try {
    await deletePresetFromDynamoDB(params.presetId);
    return setCorsHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("プリセットの削除に失敗しました:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "プリセットの削除に失敗しました" },
        { status: 500 }
      )
    );
  }
} 