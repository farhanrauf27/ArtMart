'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Download, Eye, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

useEffect(() => {
  // Check if user is logged in
  const savedUser = localStorage.getItem('user');
  if (!savedUser) {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login to view your orders',
      icon: 'warning',
      confirmButtonColor: '#b45309',
      confirmButtonText: 'Go to Login',
      background: '#1a1a1a',
      color: '#fbbf24',
    }).then(() => {
      router.push('/login');
    });
    return;
  }

  try {
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    
    // Try multiple possible keys for orders
    const possibleKeys = ['antiqueOrders', 'orders', 'myOrders'];
    let foundOrders = [];
    
    for (const key of possibleKeys) {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed)) {
            foundOrders = parsed;
            console.log(`Found orders in key: ${key}`, parsed);
            break;
          }
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    }
    
    // If no orders found, check localStorage for all data
    if (foundOrders.length === 0) {
      console.log('No orders found. Checking all localStorage:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`Key: ${key}`, localStorage.getItem(key));
      }
    }
    
    setOrders(foundOrders);
  } catch (error) {
    console.error('Error loading orders:', error);
  } finally {
    setIsLoading(false);
  }
}, [router]);

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'Pending' || order.status === 'Processing';
    if (filter === 'delivered') return order.status === 'Delivered';
    if (filter === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  // Function to get status badge color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Delivered'
        };
      case 'Processing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <RefreshCw className="w-4 h-4" />,
          text: 'Processing'
        };
      case 'Shipped':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <Truck className="w-4 h-4" />,
          text: 'Shipped'
        };
      case 'Cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Cancelled'
        };
      default:
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending'
        };
    }
  };

  // Function to calculate order status (for demo purposes)
  const calculateOrderStatus = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - orderTime) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) return 'Delivered';
    if (diffDays > 3) return 'Shipped';
    if (diffDays > 1) return 'Processing';
    return 'Pending';
  };

  // Function to view order details
  const viewOrderDetails = (order) => {
    Swal.fire({
      title: `Order #${order.orderId}`,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <p class="font-bold text-gray-900">Order Details</p>
            <p class="text-gray-600">Date: ${order.orderDate}</p>
            <p class="text-gray-600">Status: ${order.status || calculateOrderStatus(order.orderDate)}</p>
            <p class="text-gray-600">Payment: ${order.paymentMethod}</p>
            <p class="text-gray-600">Total: Rs. ${order.total.toFixed(2)}</p>
          </div>
          
          <div class="mb-4">
            <p class="font-bold text-gray-900">Customer Information</p>
            <p class="text-gray-600">Name: ${order.customer.name}</p>
            <p class="text-gray-600">Email: ${order.customer.email}</p>
            <p class="text-gray-600">Phone: ${order.customer.phone}</p>
            <p class="text-gray-600">Address: ${order.customer.address}</p>
          </div>
          
          <div>
            <p class="font-bold text-gray-900">Order Items</p>
            ${order.items.map(item => `
              <div class="flex justify-between py-2 border-b">
                <div>
                  <p class="text-gray-900">${item.name}</p>
                  <p class="text-sm text-gray-600">Qty: ${item.quantity} × Rs. ${item.price.toFixed(2)}</p>
                </div>
                <p class="font-bold">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            `).join('')}
            
            <div class="pt-4 border-t">
              <div class="flex justify-between">
                <span class="font-bold">Total</span>
                <span class="font-bold text-lg">Rs. ${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px',
      background: '#ffffff',
      color: '#000000',
    });
  };

  // Function to cancel order
  const cancelOrder = (orderId) => {
    Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // Update order status in localStorage
        const updatedOrders = orders.map(order => {
          if (order.orderId === orderId) {
            return { ...order, status: 'Cancelled' };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        localStorage.setItem('antiqueOrders', JSON.stringify(updatedOrders));
        
        Swal.fire(
          'Cancelled!',
          'Your order has been cancelled.',
          'success'
        );
      }
    });
  };

  // Function to download invoice
  const downloadInvoice = (order) => {
    Swal.fire({
      title: 'Download Invoice',
      text: 'Invoice download feature will be implemented soon!',
      icon: 'info',
      confirmButtonColor: '#b45309',
      background: '#1a1a1a',
      color: '#fbbf24',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            My <span className="text-amber-400">Orders</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100 animate-fade-in delay-100">
            Track and manage your antique purchases
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Orders Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName || user.name}'s Orders
              </h2>
              <p className="text-gray-600">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-amber-200">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'pending' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('delivered')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'delivered' 
                      ? 'bg-amber-600 text-white' 
                      : 'text-gray-700 hover:bg-amber-50'
                  }`}
                >
                  Delivered
                </button>
              </div>
              
              <Link
                href="/shop"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all"
              >
                <Home className="w-4 h-4" />
                Shop More
              </Link>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 max-w-lg mx-auto shadow-lg border border-amber-200">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h3>
                <p className="text-gray-600 mb-8">
                  {filter === 'all' 
                    ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                    : `No ${filter} orders found.`}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-amber-700 to-amber-800 text-white font-medium py-3 px-8 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => {
                const status = order.status || calculateOrderStatus(order.orderDate);
                const statusInfo = getStatusInfo(status);
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Order Header */}
                    <div className="p-6 border-b border-amber-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900">Order #{order.orderId}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              {statusInfo.icon}
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            Placed on {order.orderDate} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-800">Rs. {order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            {item.picture && (
                              <img 
                                src={item.picture} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded border border-amber-200"
                              />
                            )}
                            <div className="flex-grow">
                              <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium text-amber-800">
                                Rs. {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-amber-800 font-medium">
                              +{order.items.length - 3} more items
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-3 pt-6 border-t border-amber-100">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-800 font-medium rounded-lg border border-amber-300 hover:bg-amber-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        
                        <button
                          onClick={() => downloadInvoice(order)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                        
                        {status === 'Pending' || status === 'Processing' ? (
                          <button
                            onClick={() => cancelOrder(order.orderId)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 font-medium rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
                          >
                            Cancel Order
                          </button>
                        ) : null}
                        
                        <div className="ml-auto flex items-center gap-2">
                          {order.paymentMethod === 'Jazzcash/SadaPay' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              Payment Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}