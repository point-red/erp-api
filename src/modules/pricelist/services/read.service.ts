import { PricelistInterface } from "../entities/pricelist.entity.js";
import DatabaseConnection from "@src/database/connection.js";
import { PricelistRepository } from "@src/modules/pricelist/repositories/pricelist.repository.js";

export class ReadPricelistService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string) {
    const pricelistRepository = new PricelistRepository(this.db);
    return (await pricelistRepository.read(id)) as unknown as PricelistInterface;
  }
}
