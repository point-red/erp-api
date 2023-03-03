import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { ItemRepository } from "@src/modules/item/repositories/item.repository.js";
import { ItemGroupRepository } from "@src/modules/item-group/repositories/item-group.repository";

export class DeleteItemGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const itemGroupRepository = new ItemGroupRepository(this.db);
    const response = await itemGroupRepository.delete(id, options);
    return;
  }
}
