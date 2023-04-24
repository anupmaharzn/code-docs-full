import express from "express";
import fs from "fs/promises";
import path from "path";
type Cell = {
  id: string;
  content: string;
  type: "text" | "code";
};

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());
  const fullpath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      //Read the file
      const result = await fs.readFile(fullpath, { encoding: "utf-8" });

      //parse a list of cells out of it
      //send list of cells back to response
      res.send(JSON.parse(JSON.stringify(result)));
    } catch (error: any) {
      //ENOENT = > no entity
      //Inspect the error, see if it says that the file doesn't exist
      if (error.code === "ENOENT") {
        //add code to create a file and add default cells
        await fs.writeFile(fullpath, "[]", "utf-8");
        res.send([]);
      } else {
        throw error;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    //take the list of cells from the request obj
    //serialize them (turn them into format that can be safely written in file )
    const { cells }: { cells: Cell[] } = req.body;
    //write the cells into the file
    await fs.writeFile(fullpath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });
  return router;
};
