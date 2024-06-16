const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
const { generateFiles } = require("./utils");
const app = express();

app.use(express.json());
app.use(formidableMiddleware());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

app.post("/v1/combine", async (req, res, next) => {
  try {
    const { files } = req;
    generateFiles(files, (result) => {
      if (result.status == "success") {
        res.status(200).json({ message: "success", output: result.output });
      } else {
        res.status(500).json({ error: res.msg });
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.use("/api/output", express.static("utils/recordings"));

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
