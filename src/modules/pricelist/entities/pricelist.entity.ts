import { ObjectId } from "mongodb";

export interface PricelistInterface {
  _id?: string | ObjectId;
  name?: string;
  updatedBy_id?: string;
  createdBy_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PricelistEntity {
  public price: PricelistInterface;

  constructor(item: PricelistInterface) {
    this.price = item;
  }
}
