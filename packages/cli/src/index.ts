import { Command } from "commander";

const program = new Command()
  .name("stage-direct")
  .description("CLI pour StageDirect")
  .version("0.0.1");

program.parse();
