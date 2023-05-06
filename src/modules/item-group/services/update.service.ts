import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { ItemGroupEntity } from "@src/modules/item-group/entities/item-group.entity.js";
import { ItemGroupRepository } from "@src/modules/item-group/repositories/item-group.repository.js";

export class UpdateItemGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(userId: string, id: string, doc: DocumentInterface, session: unknown) {
    const itemGroupEntity = new ItemGroupEntity({
      name: doc.name,
      updatedBy_id: userId,
    });

    const itemGroupRepository = new ItemGroupRepository(this.db);
    return await itemGroupRepository.update(id, itemGroupEntity.item, { session });
  }
}
