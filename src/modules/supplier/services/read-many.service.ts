import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierInterface } from "../entities/supplier.entity";
import { SupplierRepository } from "../repositories/supplier.repository";
import DatabaseConnection, { QueryInterface } from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class ReadManySupplierService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, query: QueryInterface) {
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const supplierRepository = new SupplierRepository(this.db);

    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("read-many-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    const result = await supplierRepository.readMany(query);

    return {
      suppliers: result.data as unknown as Array<SupplierInterface>,
      pagination: result.pagination,
    };
  }
}
