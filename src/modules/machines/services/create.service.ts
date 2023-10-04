import { MachineEntity } from "../entities/machine.entity.js";
import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class CreateMachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(doc: DocumentInterface, session: unknown) {
    const machineEntity = new MachineEntity({
      name: doc.name,
      createdBy_id: doc._userId,
    });

    machineEntity.defaultIsArchived();

    const machineRepository = new MachineRepository(this.db);
    return await machineRepository.create(machineEntity.machine, { session });
  }
}
