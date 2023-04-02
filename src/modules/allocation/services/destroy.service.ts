import { AllocationRepository } from "../repositories/allocation.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DestroyAllocationService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const allocationRepository = new AllocationRepository(this.db);
    await allocationRepository.delete(id, options);
    return;
  }
}
