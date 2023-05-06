import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { PricelistEntity } from "@src/modules/pricelist/entities/pricelist.entity.js";
import { PricelistRepository } from "@src/modules/pricelist/repositories/pricelist.repository.js";

export class PricelistService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(userId: string, doc: DocumentInterface, session: unknown) {
    const pricelistEntity = new PricelistEntity({
      name: doc.name,
      createdBy_id: userId,
    });

    const pricelistRepository = new PricelistRepository(this.db);
    return await pricelistRepository.create(pricelistEntity.price, { session });
  }
}
