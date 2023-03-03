import { ItemGroupInterface } from "../entities/item-group.entity.js";
import DatabaseConnection from "@src/database/connection.js";
import { ItemGroupRepository } from "@src/modules/item-group/repositories/item-group.repository";

export class ReadItemGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const itemGroupRepository = new ItemGroupRepository(this.db);
    return (await itemGroupRepository.read(id)) as unknown as ItemGroupInterface;
  }
}
