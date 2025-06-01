import { createPresetTable, createWorkoutTable } from "../src/lib/dynamodb/tables";

async function main() {
  try {
    await createPresetTable();
    await createWorkoutTable();
    console.log("全てのテーブルの作成が完了しました");
  } catch (error) {
    console.error("テーブルの作成中にエラーが発生しました:", error);
    process.exit(1);
  }
}

main(); 