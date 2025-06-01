import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  },
});

async function createTables() {
  try {
    // Create PresetTable
    await client.send(
      new CreateTableCommand({
        TableName: "PresetTable",
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "presetId", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "presetId", KeyType: "RANGE" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
    );

    console.log("PresetTable created successfully");

    // Create WorkoutTable
    await client.send(
      new CreateTableCommand({
        TableName: "WorkoutTable",
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "workoutId", AttributeType: "S" },
          { AttributeName: "date", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "workoutId", KeyType: "RANGE" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "UserDateIndex",
            KeySchema: [
              { AttributeName: "userId", KeyType: "HASH" },
              { AttributeName: "date", KeyType: "RANGE" },
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
      })
    );

    console.log("WorkoutTable created successfully");
  } catch (error) {
    if ((error as any).name === "ResourceInUseException") {
      console.log("Tables already exist");
    } else {
      console.error("Error creating tables:", error);
    }
  }
}

createTables(); 