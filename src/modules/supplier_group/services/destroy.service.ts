import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierGroupRepository } from "../repositories/supplier_group.repository";
import DatabaseConnection, { DeleteOptionsInterface } from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class DestroySupplierGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, options: DeleteOptionsInterface) {
    const supplierGroupRepository = new SupplierGroupRepository(this.db);
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("delete-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    const response = await supplierGroupRepository.delete(data.id, options);
    return;
  }
}
