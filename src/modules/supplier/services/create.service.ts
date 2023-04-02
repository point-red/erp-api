import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierEntity } from "../entities/supplier.entity.js";
import { SupplierRepository } from "../repositories/supplier.repository.js";
import { validate } from "../request/supplier.request.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class SupplierService {
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

    const supplierEntity = new SupplierEntity({
      code: data.body.code,
      name: data.body.name,
      address: data.body.address ?? "",
      email: data.body.email ?? "",
      phone: data.body.phone ?? "",
      isArchived: data.body.isArchive ?? false,
      createdBy_id: userId,
    });

    const supplierRepository = new SupplierRepository(this.db);
    return await supplierRepository.create(supplierEntity.supplier, { session });
  }
}
