import { AllocationGroupEntity, AllocationGroupInterface } from "../entities/allocation-group.entity.js";
import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ReadAllocationGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const allocationGroupRepository = new AllocationGroupRepository(this.db);
    const result = (await allocationGroupRepository.read(id)) as unknown as AllocationGroupInterface;

    const allocationGroupEntity = new AllocationGroupEntity(result);

    return allocationGroupEntity.allocationGroup;
  }
}
