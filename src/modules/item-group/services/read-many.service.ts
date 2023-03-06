import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { ItemGroupInterface } from "@src/modules/item-group/entities/item-group.entity.js";
import { ItemGroupRepository } from "@src/modules/item-group/repositories/item-group.repository.js";

export class ReadManyItemGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const itemGroupRepository = new ItemGroupRepository(this.db);
    const result = await itemGroupRepository.readMany(query);

    return {
      item: result.data as unknown as Array<ItemGroupInterface>,
      pagination: result.pagination,
    };
  }
}
