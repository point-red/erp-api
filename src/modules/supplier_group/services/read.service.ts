import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierGroupInterface } from "../entities/supplier_group.entity.js";
import { SupplierGroupRepository } from "../repositories/supplier_group.repository.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class ReadSupplierGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, id: string) {
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const supplierGroupRepository = new SupplierGroupRepository(this.db);

    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("read-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    return (await supplierGroupRepository.read(id)) as unknown as SupplierGroupInterface;
  }
}
