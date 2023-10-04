import { URL } from "url";
import { ExpressCli } from "@point-hub/express-cli";
import { fileSearch } from "@point-hub/express-utils";

export class ConsoleKernel {
  public path = new URL(".", import.meta.url).pathname;
  private command: ExpressCli;

  constructor(command: ExpressCli) {
    this.command = command;
  }

  /**
   * Register the commands for the application.
   *
   * @example
   * command.register(new ExampleCommand());
   */
  async register() {
    const { default: Command1 } = await import("./commands/db-seed/index.command.js");
    const { default: Command2 } = await import("./commands/db-init/index.command.js");
    this.command.register(new Command1());
    this.command.register(new Command2());
    // const result = await fileSearch("/*.command.(js|ts)", this.path, { maxDeep: 2, regExp: true });
    // for (let i = 0; i < result.length; i++) {
    //   const { default: Command } = await import(`./${result[i].path}`);
    //   this.command.register(new Command());
    // }
  }
}
