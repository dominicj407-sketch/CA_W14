import { useEffect, useState } from "react";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:3000/getProducts");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ ADD TO CART
  const addToCart = async (p) => {
    const existing = cart.find((c) => c._id === p._id);

    if (existing) {
      if (existing.quantity >= p.stock) {
        alert("Stock limit reached");
        return;
      }

      const updatedCart = cart.map((c) =>
        c._id === p._id ? { ...c, quantity: c.quantity + 1 } : c
      );

      setCart(updatedCart);
    } else {
      if (p.stock <= 0) {
        alert("Out of stock");
        return;
      }

      setCart([...cart, { ...p, quantity: 1 }]);
    }

    // ✅ Reduce stock in backend
    await axios.put(`http://localhost:3000/updateStock/${p._id}`, {
      quantity: 1,
    });

    loadProducts();
  };

  // ✅ ADD PRODUCT
  const addProduct = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image);

    await axios.post("http://localhost:3000/addProduct", formData);

    alert("Product added");
    loadProducts();
  };

  return (
    <>
      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? "View Products" : "View Cart"}
      </button>

      {/* CART */}
      {showCart && (
        <ul>
          {cart.map((c, i) => (
            <li key={i}>
              {c.name} - ₹{c.price} (Qty: {c.quantity})
            </li>
          ))}
        </ul>
      )}

      {/* PRODUCTS */}
      {!showCart && (
        <>
          <h2>Add Product</h2>

          <input placeholder="name" onChange={(e) => setName(e.target.value)} />
          <input placeholder="price" onChange={(e) => setPrice(e.target.value)} />
          <input placeholder="stock" onChange={(e) => setStock(e.target.value)} />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button onClick={addProduct}>Add</button>

          <ul>
            {products.map((p) => (
              <li key={p._id}>
                <h3>{p.name}</h3>
                <p>₹{p.price}</p>
                <p>Stock: {p.stock}</p>

                <img
                  src={`http://localhost:3000/${p.image}`}
                  width="100"
                />

                <button onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default ProductList;