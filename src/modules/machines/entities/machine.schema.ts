import { IDatabaseAdapter } from "@src/database/connection";

export const name = "machines";

// export const restrictedFields = ["password"];

const isExists = async (db: IDatabaseAdapter) => {
  const collections = (await db.listCollections()) as [];
  return collections.some(function (el: any) {
    return el.name === name;
  });
};

export async function createCollection(db: IDatabaseAdapter) {
  try {
    if (!(await isExists(db))) {
      await db.createCollection(name);
    }

    await db.updateSchema(name, {
      bsonType: "object",
      required: ["name"],
      properties: {
        createdAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        name: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        isArchived: {
          bsonType: "bool",
          description: "must be a boolean",
        },
        createdBy_id: {
          bsonType: "objectId",
          description: "must be a string",
        },
        updatedBy_id: {
          bsonType: "objectId",
          description: "must be a string",
        },
      },
    });
    await db.createIndex(
      name,
      { name: -1 },
      {
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
        },
      }
    );
  } catch (error) {
    throw error;
  }
}

export async function dropCollection(db: IDatabaseAdapter) {
  try {
    if (await isExists(db)) {
      await db.dropCollection(name);
    }
  } catch (error) {
    throw error;
  }
}
