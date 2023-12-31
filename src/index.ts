#! /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateCommand } from "./commands/generate";

yargs(hideBin(process.argv))
  .scriptName("ng-api-parser")
  .usage("$0 <cmd> [args]")
  .command(generateCommand)
  .help().argv;