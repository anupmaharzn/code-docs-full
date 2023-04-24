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
        //create this default content
        const defaultContent = [
          {
            content:
              "## Welcome to Js-Docs 💻\nThis is an interactive coding environment. You can write Javascript,see it executed, and write comprehensive documentation using Markdown.\n\n- 📝Click any text cell (including this one) to edit it.\n\n- ⚛️You can show any React component ,string,number, or anything else by calling the **show** function. This is a function built into this environment.Call show multiple times to show multiple values.\n\n- ⬆️⬇️❌Re-order or delete cells using the buttons on the top right.\n\n- ➕  Add new cells by hovering on the divider(Center) between each cell.\n\nAll of your changes get saved to the file you opened Js-docs with. So if you ran **npx  js-docs-anup  test.js**, all of the Text and Code you write will be saved to the  **test.js**  file.",
            type: "text",
            id: "7hv",
          },
          { content: "**Example React Code**", type: "text", id: "dzm" },
          {
            content:
              'import React, { useState } from "react";\nimport ReactDOM from "react-dom";\n\nfunction App() {\n\n  // State to store count value\n  const [count, setCount] = useState(0);\n\n  // Function to increment count by 1\n  const incrementCount = () => {\n    // Update state with incremented value\n    setCount(count + 1);\n  };\n  return (\n    <div className="app">\n      <button onClick={incrementCount}>Click Here</button>\n    <h1>Count: {count}</h1> \n    </div>\n  );\n}\n\nconst rootElement = document.getElementById("root");\nReactDOM.render(<App />, rootElement);',
            type: "code",
            id: "dk0",
          },
        ];
        //add code to create a file and add default cells
        await fs.writeFile(fullpath, JSON.stringify(defaultContent), "utf-8");
        //send that default content
        res.send(defaultContent);
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
