import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierGroupEntity } from "../entities/supplier_group.entity.js";
import { SupplierGroupRepository } from "../repositories/supplier_group.repository.js";
import { validate } from "../request/supplier_group.request.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class SupplierGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(data: any, session: unknown) {
    const verifyTokenService = new VerifyTokenUserService(this.db);

    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const userId: string = authUser._id?.toString() || "";

    const found = authUser.permissions.includes("create-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    await validate(data.body, "create");

    const supplierEntity = new SupplierGroupEntity({
      name: data.body.name,
      createdBy_id: userId,
    });

    const supplierGroupRepository = new SupplierGroupRepository(this.db);
    return await supplierGroupRepository.create(supplierEntity.supplier, { session });
  }
}
