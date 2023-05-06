import { AllocationEntity, AllocationInterface } from "../entities/allocation.entity.js";
import { AllocationRepository } from "../repositories/allocation.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ReadAllocationService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const allocationRepository = new AllocationRepository(this.db);
    const result = (await allocationRepository.read(id)) as unknown as AllocationInterface;

    const allocationEntity = new AllocationEntity(result);

    return allocationEntity.allocation;
  }
}
