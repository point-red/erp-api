import { ObjectId } from "mongodb";

export interface PricelistInterface {
  _id?: string | ObjectId;
  name?: string;
}

export class PricelistEntity {
  public price: PricelistInterface;

  constructor(item: PricelistInterface) {
    this.price = item;
  }
}
