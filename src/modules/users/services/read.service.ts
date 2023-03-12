import { ObjectId } from "mongodb";
import { UserRepository } from "../repositories/user.repository.js";
import DatabaseConnection, { ReadOptionsInterface } from "@src/database/connection.js";
import { fields, limit, page, skip, sort } from "@src/database/mongodb-util.js";

export class ReadUserService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, filter?: any) {
    const userRepository = new UserRepository(this.db);
    const aggregates: any = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: { from: "roles", localField: "role_id", foreignField: "_id", as: "role" },
      },
      { $limit: 1 },
    ];

    if (filter && filter.fields) {
      aggregates.push({ $project: fields(filter.fields) });
    }

    if (filter && filter.restrictedFields) {
      aggregates.push({ $unset: filter.restrictedFields });
    }

    const aggregateResult = userRepository.aggregate(aggregates, {
      page: 1,
      pageSize: 10,
    });

    const result = (await aggregateResult) as any;

    return result.data[0];
  }
}
