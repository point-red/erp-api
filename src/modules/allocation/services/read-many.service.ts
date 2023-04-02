import { AllocationInterface } from "../entities/allocation.entity.js";
import { AllocationRepository } from "../repositories/allocation.repository.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";

export class ReadManyAllocationService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const allocationRepository = new AllocationRepository(this.db);
    const result = await allocationRepository.readMany(query);

    return {
      allocation: result.data as unknown as Array<AllocationInterface>,
      pagination: result.pagination,
    };
  }
}
