import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { AllocationEntity } from "@src/modules/allocation/entities/allocation.entity.js";
import { AllocationRepository } from "@src/modules/allocation/repositories/allocation.repository.js";

export class CreateAllocationService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(userId: string, doc: DocumentInterface, session: unknown) {
    const allocationEntity = new AllocationEntity({
      allocationGroup_id: doc.allocationGroup_id,
      name: doc.name,
      isArchived: false,
      createdBy_id: userId,
    });
    const itemRepository = new AllocationRepository(this.db);
    return await itemRepository.create(allocationEntity.allocation, { session });
  }
}
