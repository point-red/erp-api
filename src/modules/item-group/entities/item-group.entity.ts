import { ObjectId } from "mongodb";

export interface ItemGroupInterface {
  _id?: string | ObjectId;
  name?: string;
}

export class ItemGroupEntity {
  public item: ItemGroupInterface;

  constructor(item: ItemGroupInterface) {
    this.item = item;
  }
}
