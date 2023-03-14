import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { ItemRepository } from "@src/modules/item/repositories/item.repository.js";

export class DestroyItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const itemRepository = new ItemRepository(this.db);
    const response = await itemRepository.delete(id, options);
    return;
  }
}
