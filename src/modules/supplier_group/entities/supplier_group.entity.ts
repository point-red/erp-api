import { ObjectId } from "mongodb";

export interface SupplierGroupInterface {
  _id?: string | ObjectId;
  name?: string;
  updatedBy_id?: string;
  createdBy_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SupplierGroupEntity {
  public supplier: SupplierGroupInterface;

  constructor(supplier: SupplierGroupInterface) {
    this.supplier = supplier;
  }
}
