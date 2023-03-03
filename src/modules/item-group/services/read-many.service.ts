import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { ItemInterface } from "@src/modules/item/entities/item.entity.js";
import { ItemRepository } from "@src/modules/item/repositories/item.repository.js";
import { ItemGroupRepository } from "@src/modules/item-group/repositories/item-group.repository";

export class ReadManyItemGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const itemGroupRepository = new ItemGroupRepository(this.db);
    const result = await itemGroupRepository.readMany(query);

    return {
      roles: result.data as unknown as Array<ItemInterface>,
      pagination: result.pagination,
    };
  }
}
