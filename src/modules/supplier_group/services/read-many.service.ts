import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierGroupInterface } from "../entities/supplier_group.entity.js";
import { SupplierGroupRepository } from "../repositories/supplier_group.repository.js";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class ReadManySupplierGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, query: QueryInterface) {
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const supplierGroupRepository = new SupplierGroupRepository(this.db);

    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("read-many-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    const result = await supplierGroupRepository.readMany(query);

    return {
      suppliers: result.data as unknown as Array<SupplierGroupInterface>,
      pagination: result.pagination,
    };
  }
}
