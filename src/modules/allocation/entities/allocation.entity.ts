import { ObjectId } from "mongodb";

export interface AllocationInterface {
  _id?: string | ObjectId;
  allocationGroup_id?: string;
  name?: string;
  isArchived?: boolean;
  updatedBy_id?: string;
  createdBy_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AllocationEntity {
  public allocation: AllocationInterface;

  constructor(allocation: AllocationInterface) {
    this.allocation = allocation;
  }
}
