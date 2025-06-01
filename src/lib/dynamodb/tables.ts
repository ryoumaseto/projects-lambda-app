import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

export async function createPresetTable() {
  const command = new CreateTableCommand({
    TableName: "PresetTable",
    AttributeDefinitions: [
      {
        AttributeName: "userId",
        AttributeType: "S",
      },
      {
        AttributeName: "presetId",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "userId",
        KeyType: "HASH",
      },
      {
        AttributeName: "presetId",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  try {
    const response = await client.send(command);
    console.log("PresetTableの作成に成功しました:", response);
    return response;
  } catch (error) {
    if ((error as any).name === "ResourceInUseException") {
      console.log("PresetTableは既に存在します");
      return;
    }
    console.error("PresetTableの作成に失敗しました:", error);
    throw error;
  }
}

export async function createWorkoutTable() {
  const command = new CreateTableCommand({
    TableName: "WorkoutTable",
    AttributeDefinitions: [
      {
        AttributeName: "userId",
        AttributeType: "S",
      },
      {
        AttributeName: "workoutId",
        AttributeType: "S",
      },
      {
        AttributeName: "date",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "userId",
        KeyType: "HASH",
      },
      {
        AttributeName: "workoutId",
        KeyType: "RANGE",
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "UserDateIndex",
        KeySchema: [
          {
            AttributeName: "userId",
            KeyType: "HASH",
          },
          {
            AttributeName: "date",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  try {
    const response = await client.send(command);
    console.log("WorkoutTableの作成に成功しました:", response);
    return response;
  } catch (error) {
    if ((error as any).name === "ResourceInUseException") {
      console.log("WorkoutTableは既に存在します");
      return;
    }
    console.error("WorkoutTableの作成に失敗しました:", error);
    throw error;
  }
} 