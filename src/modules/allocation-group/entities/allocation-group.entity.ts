import { ObjectId } from "mongodb";

export interface AllocationGroupInterface {
  _id?: string | ObjectId;
  name?: string;
  isArchived?: boolean;
  updatedBy_id?: string;
  createdBy_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AllocationGroupEntity {
  public allocationGroup: AllocationGroupInterface;

  constructor(allocationGroup: AllocationGroupInterface) {
    this.allocationGroup = allocationGroup;
  }
}
