import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";
import { PricelistRepository } from "@src/modules/pricelist/repositories/pricelist.repository.js";
import { PricelistEntity } from "@src/modules/pricelist/entities/pricelist.entity.js";

export class UpdatePricelistService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, doc: DocumentInterface, session: unknown) {
    const pricelistEntity = new PricelistEntity({
      name: doc.name,
    });

    const pricelistRepository = new PricelistRepository(this.db);
    return await pricelistRepository.update(id, pricelistEntity.price, { session });
  }
}
