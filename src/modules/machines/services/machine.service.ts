import { ObjectId } from "mongodb";
import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection, { ReadOptionsInterface } from "@src/database/connection.js";
import { fields, limit, page, skip, sort } from "@src/database/mongodb-util.js";

export class MachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async read(id: any) {
    const machineRepository = new MachineRepository(this.db);
    console.log("read", id);
    const aggregates: any = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      { $limit: 1 },
    ];

    const aggregateResult = machineRepository.aggregate(aggregates, { page: 1, pageSize: 10 });

    const result = (await aggregateResult) as any;

    return result.data[0];
  }
}
