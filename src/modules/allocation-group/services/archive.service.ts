import { AllocationGroupEntity } from "../entities/allocation-group.entity.js";
import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ArchiveAllocationGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, userId: string, session: unknown) {
    const allocationGroupEntity = new AllocationGroupEntity({
      isArchived: true,
      updatedBy_id: userId,
    });

    const allocationGroupRepository = new AllocationGroupRepository(this.db);
    return await allocationGroupRepository.update(id, allocationGroupEntity.allocationGroup, { session });
  }
}
