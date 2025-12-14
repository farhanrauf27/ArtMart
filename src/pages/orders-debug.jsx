'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function OrdersDebugPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    // Load all localStorage data to debug
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        allData[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        allData[key] = localStorage.getItem(key);
      }
    }
    setLocalStorageData(allData);
    
    // Try to load orders from different possible keys
    const possibleKeys = ['antiqueOrders', 'orders', 'cart', 'user'];
    possibleKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        console.log(`Found data in key "${key}":`, JSON.parse(data));
      }
    });
    
    // Specifically try antiqueOrders
    const savedOrders = localStorage.getItem('antiqueOrders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('Orders found in antiqueOrders:', parsedOrders);
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error parsing orders:', error);
      }
    }
  }, []);

  const createSampleOrder = () => {
    const sampleOrder = {
      orderId: 'ANTQ-' + Date.now().toString().slice(-8),
      orderDate: new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [
        {
          id: '1',
          name: 'Sample Antique Mirror',
          price: 5000,
          quantity: 1,
          picture: '/mirror1.jpeg',
          brand: 'Antique'
        }
      ],
      total: 5250,
      customer: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '03031234567',
        address: 'Test Address, Lahore, Punjab 54000'
      },
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      estimatedDelivery: 'December 25, 2024',
      subtotal: 5000,
      shipping: 0,
      tax: 250
    };

    const existingOrders = JSON.parse(localStorage.getItem('antiqueOrders') || '[]');
    existingOrders.unshift(sampleOrder);
    localStorage.setItem('antiqueOrders', JSON.stringify(existingOrders));
    setOrders(existingOrders);
    
    alert('Sample order created!');
  };

  const clearOrders = () => {
    localStorage.removeItem('antiqueOrders');
    setOrders([]);
    alert('Orders cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
      <Navbar />
      
      <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Orders <span className="text-amber-400">Debug</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100">
            Debugging localStorage issues
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Debug Controls */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Debug Controls</h2>
            <div className="flex gap-4">
              <button
                onClick={createSampleOrder}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Sample Order
              </button>
              <button
                onClick={clearOrders}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear All Orders
              </button>
              <button
                onClick={() => router.push('/orders')}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Go to Orders Page
              </button>
            </div>
          </div>

          {/* LocalStorage Data */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">LocalStorage Data</h2>
            <div className="space-y-4">
              {Object.keys(localStorageData).map(key => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Key: "{key}"</h3>
                  <pre className="text-sm bg-black text-white p-3 rounded overflow-auto">
                    {JSON.stringify(localStorageData[key], null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Found */}
          <div className="p-6 bg-white rounded-xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Orders Found: {orders.length}
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No orders found in localStorage</p>
                <p className="text-sm text-gray-500">
                  Click "Create Sample Order" to add a test order
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900">Order #{order.orderId}</h3>
                    <p className="text-gray-600">Date: {order.orderDate}</p>
                    <p className="text-gray-600">Total: Rs. {order.total}</p>
                    <p className="text-gray-600">Customer: {order.customer?.name}</p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-amber-600 hover:text-amber-700">
                        View Details
                      </summary>
                      <pre className="mt-2 text-sm bg-black text-white p-3 rounded overflow-auto">
                        {JSON.stringify(order, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">How to Fix:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Create Sample Order" to test if orders are saved</li>
              <li>Check if "antiqueOrders" key appears in LocalStorage Data section</li>
              <li>Go to checkout page and place a real order</li>
              <li>Check that the order appears here</li>
              <li>If not, check your checkout page's localStorage saving code</li>
            </ol>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}