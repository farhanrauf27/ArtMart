// pages/api/products/index.js
import connectMongo from '../../../../lib/mongodb';
import Product from '../../../../models/Products';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
