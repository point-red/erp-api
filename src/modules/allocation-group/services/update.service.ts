import { AllocationGroupEntity } from "../entities/allocation-group.entity.js";
import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateAllocationGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, userId: string, doc: DocumentInterface, session: unknown) {
    const allocationGroupEntity = new AllocationGroupEntity({
      name: doc.name,
      updatedBy_id: userId,
    });

    const allocationGroupRepository = new AllocationGroupRepository(this.db);
    return await allocationGroupRepository.update(id, allocationGroupEntity.allocationGroup, { session });
  }
}
