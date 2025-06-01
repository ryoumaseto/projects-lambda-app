import { NextResponse } from "next/server";
import { PresetFormData } from "@/types/preset";
import {
  createPresetInDynamoDB,
  getPresetsFromDynamoDB,
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

// GETリクエストハンドラー
export async function GET() {
  try {
    const presets = await getPresetsFromDynamoDB();
    return setCorsHeaders(NextResponse.json(presets));
  } catch (error) {
    console.error("プリセットの取得に失敗しました:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "プリセットの取得に失敗しました" },
        { status: 500 }
      )
    );
  }
}

// POSTリクエストハンドラー
export async function POST(request: Request) {
  try {
    const data: PresetFormData = await request.json();
    const preset = await createPresetInDynamoDB(data);
    return setCorsHeaders(NextResponse.json(preset));
  } catch (error) {
    console.error("プリセットの作成に失敗しました:", error);
    return setCorsHeaders(
      NextResponse.json(
        { error: "プリセットの作成に失敗しました" },
        { status: 500 }
      )
    );
  }
}

// PUTリクエストハンドラー
export async function PUT(request: Request) {
  try {
    const { presetId, ...data }: { presetId: string } & PresetFormData =
      await request.json();
    await updatePresetInDynamoDB(presetId, data);
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
export async function DELETE(request: Request) {
  try {
    const { presetId } = await request.json();
    await deletePresetFromDynamoDB(presetId);
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