import { getSession } from 'next-auth/react';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check if user is admin
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { status, paymentMethod } = req.query;
      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (paymentMethod && paymentMethod !== 'all') {
        query.paymentMethod = paymentMethod;
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(100);

      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}