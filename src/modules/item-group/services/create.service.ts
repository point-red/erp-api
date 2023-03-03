import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { ItemGroupEntity } from "@src/modules/item-group/entities/item-group.entity.js";
import { ItemGroupRepository } from "@src/modules/item-group/repositories/item-group.repository.js";

export class ItemGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(doc: DocumentInterface, session: unknown) {
    const itemGroupEntity = new ItemGroupEntity({
      name: doc.name,
    });

    console.log(itemGroupEntity.item);

    const itemRepository = new ItemGroupRepository(this.db);
    return await itemRepository.create(itemGroupEntity.item, { session });
  }
}
