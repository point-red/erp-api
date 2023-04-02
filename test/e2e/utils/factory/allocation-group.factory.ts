import DatabaseConnection from "@src/database/connection.js";

export default class AllocationGroupFactory {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async create() {
    const session = this.db.startSession();
    const allocationGroup = {
      name: "allocationGroup A",
    };
    await this.db.collection("allocationGroups").deleteAll();
    return await this.db.collection("allocationGroups").create(allocationGroup, { session });
  }
}
