import { ObjectId } from "mongodb";

export interface MachineInterface {
  _id?: string | ObjectId;
  name?: string;
  isArchived?: boolean;
  createdBy_id?: string | ObjectId;
  updatedBy_id?: string | ObjectId;
}

export class MachineEntity {
  public machine: MachineInterface;

  constructor(machine: MachineInterface) {
    this.machine = machine;
  }

  public defaultIsArchived() {
    this.machine.isArchived = false;
  }
}
