import { ObjectId } from "mongodb";

export interface ItemGroupInterface {
  _id?: string | ObjectId;
  name?: string;
  updatedBy_id?: string;
  createdBy_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ItemGroupEntity {
  public item: ItemGroupInterface;

  constructor(item: ItemGroupInterface) {
    this.item = item;
  }
}
