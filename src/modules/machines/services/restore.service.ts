import { MachineEntity } from "../entities/machine.entity.js";
import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class RestoreMachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, session: unknown) {
    const machineEntity = new MachineEntity({
      isArchived: false,
    });

    const machineRepository = new MachineRepository(this.db);
    return await machineRepository.update(id, machineEntity.machine, { session });
  }
}
