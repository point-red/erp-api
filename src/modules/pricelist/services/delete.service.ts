import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { PricelistRepository } from "@src/modules/pricelist/repositories/pricelist.repository.js";

export class DeletePricelistService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(id: string, options: DeleteOptionsInterface) {
    const pricelistRepository = new PricelistRepository(this.db);
    const response = await pricelistRepository.delete(id, options);
    return;
  }
}
