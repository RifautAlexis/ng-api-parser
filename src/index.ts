#! /usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateCommand } from "./commands/generate";

// yargs(hideBin(process.argv))
//   .scriptName("ng-api-parser")
//   .usage("$0 <cmd> [args]")
//   .command(generateCommand)
//   .help().argv;

yargs(hideBin(process.argv))
  .command(
    "greet [name]",
    "greet a person",
    (yargs) => {
      return yargs.positional("name", {
        describe: "the name of the person to greet",
        type: "string",
        default: "World",
      });
    },
    (argv) => {
      console.log(`Hello, ${argv.name}!`);
    }
  )
  .parse();
