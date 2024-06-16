const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

const app = express();

app.use(express.json());
app.use(formidableMiddleware());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

app.post("/v1/combine", async (req, res, next) => {
  try {
    console.log(req.fields); // contains non-file fields
    console.log(req.files); // contains files
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(__dirname);
  console.log(`Server is running on port ${port}`);
});
