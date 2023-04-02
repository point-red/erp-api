import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { AllocationGroupEntity } from "@src/modules/allocation-group/entities/allocation-group.entity.js";
import { AllocationGroupRepository } from "@src/modules/allocation-group/repositories/allocation-group.repository.js";

export class CreateAllocationGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(userId: string, doc: DocumentInterface, session: unknown) {
    const allocationGroupEntity = new AllocationGroupEntity({
      name: doc.name,
      isArchived: false,
      createdBy_id: userId,
    });
    const allocationGroupRepository = new AllocationGroupRepository(this.db);
    return await allocationGroupRepository.create(allocationGroupEntity.allocationGroup, { session });
  }
}
