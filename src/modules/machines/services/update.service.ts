import { MachineEntity } from "../entities/machine.entity.js";
import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class UpdateMachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const machineEntity = new MachineEntity({
      name: doc.name,
      updatedBy_id: doc._userId,
    });

    const machineRepository = new MachineRepository(this.db);
    return await machineRepository.update(id, machineEntity.machine, { session });
  }
}
