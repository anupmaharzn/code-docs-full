import path from "path";
import { Command } from "commander";
//this is from our local api export serve function
import { serve } from "@js-docs-anup/api";

const isProduction = process.env.NODE_ENV === "production";

//note that [] is otional value
//note that <> is required value
export const serveCommand = new Command()
  //user can put serve arugment in command line, other arugment options
  // filename is name used to save the cells
  //if not provide default to codedocs.js in action
  .command("serve [filename]")
  //flag ,description,default port value //cli maa number providee garini string auxa so default string
  .option("-p,--port <number>", "port to run server on", "4005")
  //--help flag will give this desc of serve command
  .description("Open a file for editing")
  //action to perform when user give serve arg
  .action(async (filename = "codedocs.js", options: { port: string }) => {
    try {
      //gives absolute path
      //path.dirname(filename) just extract dir name ,if just filename then empty string
      const dir = path.join(process.cwd(), path.dirname(filename));
      //we need port as number in server tei vara parseInt
      //path.basename(filename) => gives just filename even if we provide relative path it just extract filname
      //(port,actual-filename,actual-dir(absolute))
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file `
      );
    } catch (err: any) {
      if (err.code === "EADDRINUSE") {
        console.error("Port is in use,Try running on a different port.");
      } else {
        console.log("here's the problem", err.message);
      }
      //exiting after unsucessful run
      process.exit(1);
    }
  });
