import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { PricelistInterface } from "@src/modules/pricelist/entities/pricelist.entity.js";
import { PricelistRepository } from "@src/modules/pricelist/repositories/pricelist.repository.js";

export class ReadManyPricelistService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(query: QueryInterface) {
    const pricelistRepository = new PricelistRepository(this.db);
    const result = await pricelistRepository.readMany(query);

    return {
      price: result.data as unknown as Array<PricelistInterface>,
      pagination: result.pagination,
    };
  }
}
