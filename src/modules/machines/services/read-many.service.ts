import { MachineRepository } from "../repositories/machine.repository.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";

export class ReadManyMachineService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const machineRepository = new MachineRepository(this.db);
    return await machineRepository.readMany(query);
  }
}
