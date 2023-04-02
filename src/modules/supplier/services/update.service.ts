import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierEntity, SupplierInterface } from "../entities/supplier.entity.js";
import { SupplierRepository } from "../repositories/supplier.repository.js";
import { validate } from "../request/supplier.request.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class UpdateSupplierService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }
  public async handle(data: any, session: unknown) {
    const verifyTokenService = new VerifyTokenUserService(this.db);
    const authorizationHeader = data.headers.authorization ?? "";
    const supplierRepository = new SupplierRepository(this.db);

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }

    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("update-supplier");
    if (!found) {
      throw new ApiError(403);
    }

    const result = (await supplierRepository.read(data.id)) as unknown as SupplierInterface;
    await validate(data.body, "update");
    const userId: string = authUser._id?.toString() || "";
    const supplierEntity = new SupplierEntity({
      code: data.body.code ?? result.code,
      name: data.body.name ?? result.name,
      address: data.body.address ?? result.address,
      email: data.body.email ?? result.email,
      phone: data.body.phone ?? result.phone,
      isArchived: data.body.isArchived ?? result.isArchived,
      updatedBy_id: userId,
    });
    return await supplierRepository.update(data.id, supplierEntity.supplier, { session });
  }
}
