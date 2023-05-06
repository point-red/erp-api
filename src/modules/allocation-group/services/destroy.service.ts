import { AllocationGroupRepository } from "../repositories/allocation-group.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DestroyAllocationGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const allocationGroupRepository = new AllocationGroupRepository(this.db);
    await allocationGroupRepository.delete(id, options);
    return;
  }
}
