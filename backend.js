// server.js
const express = require('express');
const app = express();
app.use(express.json());

// Simulasi Database Relasional (In-Memory SQL Tables)
let db = {
    users: [{ id: 1, name: "Budi (User Admin)" }],
    products: [
        { id: 101, name: "Buku Pemrograman Web", price: 85000, category: "Buku" },
        { id: 102, name: "Mouse Gaming", price: 250000, category: "Elektronik" },
        { id: 103, name: "Baju Gamis", price: 450000, category: "Pakaian" }
    ],
    orders: [],
    orderDetails: []
};

// [READ] Endpoint: Ambil Semua Produk dari SQL DB
app.get('/api/products', (req, res) => {
    res.json(db.products);
});

// [CREATE] Endpoint: Tambah Produk Baru ke SQL DB
app.post('/api/products', (req, res) => {
    const { name, price, category } = req.body;
    const newProduct = { id: Date.now(), name, price: parseFloat(price), category };
    db.products.push(newProduct);
    
    res.status(201).json({ message: "Produk berhasil ditambahkan ke SQL DB", data: newProduct });
});

// [TRANSACTION] Endpoint: Checkout (Sinkronisasi dari Client State ke SQL Orders)
app.post('/api/checkout', (req, res) => {
    const { userId, items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: "Keranjang kosong" });

    const orderId = Date.now();
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    // Insert to Orders Table
    db.orders.push({ id: orderId, userId, totalAmount });

    // Insert to OrderDetails Table (Foreign Key Relationship)
    items.forEach(item => {
        db.orderDetails.push({ orderId, productId: item.id, price: item.price });
    });

    res.status(201).json({ message: "Transaksi berhasil tersimpan di DB SQL", orderId });
});

app.listen(3000, () => console.log("Backend Server berjalan di port 3000"));