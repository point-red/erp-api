import { ObjectId } from "mongodb";

export interface ItemInterface {
  _id?: string | ObjectId;
  code?: string;
  name?: string;
  chartOfAccount?: string;
  hasProductionNumber?: boolean;
  hasExpiryDate?: boolean;
  unit?: string;
  isArchived: boolean;
  converter?: [
    {
      name?: string;
      multiply?: number;
    }
  ];
}

export class ItemEntity {
  public item: ItemInterface;

  constructor(item: ItemInterface) {
    this.item = item;
  }
}
