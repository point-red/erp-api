import { AllocationEntity } from "../entities/allocation.entity.js";
import { AllocationRepository } from "../repositories/allocation.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateAllocationService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, userId: string, doc: DocumentInterface, session: unknown) {
    const allocationEntity = new AllocationEntity({
      name: doc.name,
      updatedBy_id: userId,
    });

    const allocationRepository = new AllocationRepository(this.db);
    return await allocationRepository.update(id, allocationEntity.allocation, { session });
  }
}
