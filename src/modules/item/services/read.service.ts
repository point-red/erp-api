import { ItemEntity, ItemInterface } from "../entities/item.entity.js";
import { ItemRepository } from "../repositories/item.repository.js";
import DatabaseConnection from "@src/database/connection.js";

export class ReadItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const itemRepository = new ItemRepository(this.db);
    return (await itemRepository.read(id,)) as unknown as ItemInterface;
  }
}
