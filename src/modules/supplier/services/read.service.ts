import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierInterface } from "../entities/supplier.entity.js";
import { SupplierRepository } from "../repositories/supplier.repository.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class ReadSupplierService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, id: string) {
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const supplierRepository = new SupplierRepository(this.db);

    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("read-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    return (await supplierRepository.read(id)) as unknown as SupplierInterface;
  }
}
