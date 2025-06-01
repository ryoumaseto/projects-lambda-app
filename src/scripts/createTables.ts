import { createPresetTable, createWorkoutTable } from "../lib/dynamodb/tables";

async function main() {
  try {
    console.log("テーブルの作成を開始します...");
    
    // PresetTableの作成
    await createPresetTable();
    console.log("PresetTableの作成が完了しました");
    
    // WorkoutTableの作成
    await createWorkoutTable();
    console.log("WorkoutTableの作成が完了しました");
    
    console.log("全てのテーブルの作成が完了しました");
  } catch (error) {
    console.error("テーブルの作成中にエラーが発生しました:", error);
    process.exit(1);
  }
}

main(); 