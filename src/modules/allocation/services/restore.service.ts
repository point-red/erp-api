import { AllocationEntity } from "../entities/allocation.entity.js";
import { AllocationRepository } from "../repositories/allocation.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class RestoreAllocationService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, userId: string, session: unknown) {
    const allocationEntity = new AllocationEntity({
      isArchived: false,
      updatedBy_id: userId,
    });

    const allocationRepository = new AllocationRepository(this.db);
    return await allocationRepository.update(id, allocationEntity.allocation, { session });
  }
}
