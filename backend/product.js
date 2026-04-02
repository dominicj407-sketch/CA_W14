const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/productDB");

const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  image: String,
  stock: Number
});

// ✅ ADD PRODUCT
app.post("/add-product", async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    stock: req.body.stock
  });
  res.json(product);
});

// ✅ GET PRODUCTS
app.get("/getProducts", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ UPDATE STOCK
app.put("/update-stock/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json("Product not found");

  if (product.stock < req.body.quantity) {
    return res.status(400).json("Not enough stock");
  }

  product.stock -= req.body.quantity;
  await product.save();

  res.json(product);
});

app.listen(3002, () => console.log("Product Service running on 3002"));