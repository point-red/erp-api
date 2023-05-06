import { AllocationGroupInterface } from "../entities/allocation-group.entity.js";
import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";

export class ReadManyAllocationGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const allocationGroupRepository = new AllocationGroupRepository(this.db);
    const result = await allocationGroupRepository.readMany(query);

    return {
      allocationGroup: result.data as unknown as Array<AllocationGroupInterface>,
      pagination: result.pagination,
    };
  }
}
