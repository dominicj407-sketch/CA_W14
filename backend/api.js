const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

app.post("/register", async (req, res) => {
  const response = await axios.post("http://localhost:3001/register", req.body);
  res.json(response.data);
});

app.post("/login", async (req, res) => {
  const response = await axios.post("http://localhost:3001/login", req.body);
  res.json(response.data);
});

app.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    if (req.file) {
      req.body.image=req.file.filename;
    }
    else{
      req.body.image="";
    }
    const response = await axios.post(
      "http://localhost:3002/add-product",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
app.put("/updateStock/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `http://localhost:3002/update-stock/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
app.get("/getProducts", async (req, res) => {
  const response = await axios.get("http://localhost:3002/getProducts");
  res.json(response.data);
});

app.listen(3000, () => console.log("API Gateway running on 3000"));