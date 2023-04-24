#!/usr/bin/env node
import { program } from "commander";
import { serveCommand } from "./commands/serve";
//adding 'serve' command
//if multiple chain .addCommand
program.addCommand(serveCommand);

//tell commander to look at command line arguments
//try to parse them
//figure out user try to run and exute appropriate action

program.parse(process.argv);
