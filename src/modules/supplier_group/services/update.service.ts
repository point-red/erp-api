import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierGroupEntity, SupplierGroupInterface } from "../entities/supplier_group.entity.js";
import { SupplierGroupRepository } from "../repositories/supplier_group.repository.js";
import { validate } from "../request/supplier_group.request.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class UpdateSuppierGroupService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, session: unknown) {
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const authorizationHeader = data.headers.authorization ?? "";
    const supplierGroupRepository = new SupplierGroupRepository(this.db);

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("update-supplier");
    if (!found) {
      throw new ApiError(403);
    }

    const result = (await supplierGroupRepository.read(data.id)) as unknown as SupplierGroupInterface;
    await validate(data.body, "update");
    const userId: string = authUser._id?.toString() || "";
    const supplierEntity = new SupplierGroupEntity({
      name: data.body.name ?? result.name,
      updatedBy_id: userId,
    });
    return await supplierGroupRepository.update(data.id, supplierEntity.supplier, { session });
  }
}
