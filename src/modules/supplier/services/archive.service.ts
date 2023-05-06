import ApiError from "@point-hub/express-error-handler/lib/api-error.js";
import { SupplierInterface } from "../entities/supplier.entity.js";
import { SupplierRepository } from "../repositories/supplier.repository.js";
import DatabaseConnection from "@src/database/connection.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";

export class ArchiveService {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(data: any, session: unknown) {
    const supplierRepository = new SupplierRepository(this.db);
    const verifyTokenService = new VerifyTokenUserService(this.db);

    const authorizationHeader = data.headers.authorization ?? "";

    if (authorizationHeader === "") {
      throw new ApiError(401);
    }
    const authUser = await verifyTokenService.handle(authorizationHeader);
    const found = authUser.permissions.includes("archive-supplier");
    if (!found) {
      throw new ApiError(403);
    }
    const supplier = (await supplierRepository.read(data.id, { session })) as unknown as SupplierInterface;

    supplier.isArchived = true;

    return await supplierRepository.update(data.id, supplier, { session });
  }
}
