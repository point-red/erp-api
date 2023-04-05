import { ObjectId } from "mongodb";
import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection, { ReadOptionsInterface } from "@src/database/connection.js";
import { fields, limit, page, skip, sort } from "@src/database/mongodb-util.js";

export class ReadMachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, filter?: any) {
    const machineRepository = new MachineRepository(this.db);
    const aggregates: any = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      { $limit: 1 },
    ];

    if (filter && filter.fields) {
      aggregates.push({ $project: fields(filter.fields) });
    }

    if (filter && filter.restrictedFields) {
      aggregates.push({ $unset: filter.restrictedFields });
    }

    const aggregateResult = machineRepository.aggregate(aggregates, { page: 1, pageSize: 10 });

    const result = (await aggregateResult) as any;
    result.data[0].createdAt = new Date(result.data[0].createdAt);

    return result.data[0];
  }
}
