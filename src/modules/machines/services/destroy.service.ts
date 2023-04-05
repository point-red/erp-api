import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";

export class DestroyMachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options?: DeleteOptionsInterface) {
    const machineRepository = new MachineRepository(this.db);
    return await machineRepository.delete(id, options);
  }
}
