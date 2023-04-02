import { ObjectId } from "mongodb";

export interface SupplierInterface {
  _id?: string | ObjectId;
  code?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  isArchived: boolean;
  updatedBy_id?: string;
  createdBy_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SupplierEntity {
  public supplier: SupplierInterface;

  constructor(supplier: SupplierInterface) {
    this.supplier = supplier;
  }
}
