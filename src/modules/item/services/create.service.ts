import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { ItemEntity } from "@src/modules/item/entities/item.entity.js";
import { ItemRepository } from "@src/modules/item/repositories/item.repository.js";

export class ItemService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(userId: string, doc: DocumentInterface, session: unknown) {
    const itemEntity = new ItemEntity({
      code: doc.code,
      name: doc.name,
      chartOfAccount: doc.chartOfAccount,
      hasProductionNumber: doc.hasProductionNumber,
      hasExpiryDate: doc.hasExpiryDate,
      unit: doc.unit,
      converter: doc.converter,
      isArchived: false,
      createdBy_id: userId,
    });

    const itemRepository = new ItemRepository(this.db);
    return await itemRepository.create(itemEntity.item, { session });
  }
}
