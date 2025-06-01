import { PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../dynamodb/client";
import { Preset, PresetFormData } from "@/types/preset";
import { Workout, WorkoutFormData, WorkoutPeriod } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";

const PRESET_TABLE = "PresetTable";
const WORKOUT_TABLE = "WorkoutTable";

// 開発用の固定ユーザーID
const DEV_USER_ID = "dev-user";

// プリセット関連の操作
export async function createPresetInDynamoDB(data: PresetFormData): Promise<Preset> {
  const now = new Date().toISOString();
  const preset: Preset = {
    userId: DEV_USER_ID,
    presetId: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  try {
    console.log("Creating preset:", preset);
    await docClient.send(
      new PutCommand({
        TableName: PRESET_TABLE,
        Item: preset,
      })
    );
    return preset;
  } catch (error) {
    console.error("Error in createPresetInDynamoDB:", error);
    throw error;
  }
}

export async function getPresetsFromDynamoDB(): Promise<Preset[]> {
  try {
    console.log("Fetching presets for user:", DEV_USER_ID);
    const result = await docClient.send(
      new QueryCommand({
        TableName: PRESET_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": DEV_USER_ID,
        },
      })
    );
    console.log("Fetched presets:", result.Items);
    return (result.Items as Preset[]) || [];
  } catch (error) {
    console.error("Error in getPresetsFromDynamoDB:", error);
    throw error;
  }
}

export async function updatePresetInDynamoDB(presetId: string, data: PresetFormData): Promise<void> {
  const now = new Date().toISOString();

  await docClient.send(
    new UpdateCommand({
      TableName: PRESET_TABLE,
      Key: {
        userId: DEV_USER_ID,
        presetId,
      },
      UpdateExpression:
        "set #name = :name, category = :category, defaultSets = :defaultSets, defaultWeight = :defaultWeight, description = :description, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#name": "name", // nameは予約語なので、属性名として使用
      },
      ExpressionAttributeValues: {
        ":name": data.name,
        ":category": data.category,
        ":defaultSets": data.defaultSets,
        ":defaultWeight": data.defaultWeight,
        ":description": data.description || null,
        ":updatedAt": now,
      },
    })
  );
}

export async function deletePresetFromDynamoDB(presetId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: PRESET_TABLE,
      Key: {
        userId: DEV_USER_ID,
        presetId,
      },
    })
  );
}

// トレーニング記録関連の操作
export async function createWorkoutInDynamoDB(data: WorkoutFormData): Promise<Workout> {
  const now = new Date().toISOString();
  const workout: Workout = {
    userId: DEV_USER_ID,
    workoutId: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  try {
    console.log("Creating workout:", workout);
    await docClient.send(
      new PutCommand({
        TableName: WORKOUT_TABLE,
        Item: workout,
      })
    );
    return workout;
  } catch (error) {
    console.error("Error in createWorkoutInDynamoDB:", error);
    throw error;
  }
}

export async function getWorkoutsFromDynamoDB(period: WorkoutPeriod = "all"): Promise<Workout[]> {
  try {
    let startDate: string | undefined;

    // 期間に応じて開始日を設定
    if (period !== "all") {
      const now = new Date();
      switch (period) {
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split("T")[0];
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split("T")[0];
          break;
        case "3months":
          startDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split("T")[0];
          break;
        case "6months":
          startDate = new Date(now.setMonth(now.getMonth() - 6)).toISOString().split("T")[0];
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split("T")[0];
          break;
      }
    }

    console.log("Fetching workouts for user:", DEV_USER_ID, "period:", period, "startDate:", startDate);

    const params: any = {
      TableName: WORKOUT_TABLE,
      IndexName: "UserDateIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": DEV_USER_ID,
      },
      ScanIndexForward: false, // 日付の降順でソート
    };

    // 期間が指定されている場合は条件を追加
    if (startDate) {
      params.KeyConditionExpression += " AND #date >= :startDate";
      params.ExpressionAttributeNames = {
        "#date": "date",
      };
      params.ExpressionAttributeValues[":startDate"] = startDate;
    }

    console.log("Query params:", params);
    const result = await docClient.send(new QueryCommand(params));
    console.log("Query result:", result);
    return (result.Items as Workout[]) || [];
  } catch (error) {
    console.error("Error in getWorkoutsFromDynamoDB:", error);
    throw error;
  }
}

export async function getWorkoutFromDynamoDB(workoutId: string): Promise<Workout | null> {
  try {
    console.log("Fetching workout:", workoutId);
    const result = await docClient.send(
      new QueryCommand({
        TableName: WORKOUT_TABLE,
        KeyConditionExpression: "userId = :userId AND workoutId = :workoutId",
        ExpressionAttributeValues: {
          ":userId": DEV_USER_ID,
          ":workoutId": workoutId,
        },
      })
    );
    console.log("Fetched workout:", result.Items?.[0]);
    return (result.Items?.[0] as Workout) || null;
  } catch (error) {
    console.error("Error in getWorkoutFromDynamoDB:", error);
    throw error;
  }
}

export async function updateWorkoutInDynamoDB(workoutId: string, data: WorkoutFormData): Promise<void> {
  try {
    console.log("Updating workout:", workoutId, data);
    const now = new Date().toISOString();
    await docClient.send(
      new UpdateCommand({
        TableName: WORKOUT_TABLE,
        Key: {
          userId: DEV_USER_ID,
          workoutId,
        },
        UpdateExpression:
          "set #date = :date, exercises = :exercises, memo = :memo, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#date": "date",
        },
        ExpressionAttributeValues: {
          ":date": data.date,
          ":exercises": data.exercises,
          ":memo": data.memo || null,
          ":updatedAt": now,
        },
      })
    );
  } catch (error) {
    console.error("Error in updateWorkoutInDynamoDB:", error);
    throw error;
  }
}

export async function deleteWorkoutFromDynamoDB(workoutId: string): Promise<void> {
  try {
    console.log("Deleting workout:", workoutId);
    await docClient.send(
      new DeleteCommand({
        TableName: WORKOUT_TABLE,
        Key: {
          userId: DEV_USER_ID,
          workoutId,
        },
      })
    );
  } catch (error) {
    console.error("Error in deleteWorkoutFromDynamoDB:", error);
    throw error;
  }
} 