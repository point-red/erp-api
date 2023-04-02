import DatabaseConnection from "@src/database/connection.js";
import { hash } from "@src/utils/hash.js";

export default class UserFactory {
  private db: DatabaseConnection;
  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async createUsers() {
    const password = await hash("admin2024");
    const userPassword = await hash("user2024");

    const usersSeed = [
      {
        username: "admin",
        email: "admin@example.com",
        password: password,
        name: "Admin",
      },
      {
        username: "user",
        email: "user@example.com",
        password: userPassword,
        name: "User",
      },
    ];
    await this.db.collection("users").deleteAll();
    await this.db.collection("users").createMany(usersSeed);
  }
}
