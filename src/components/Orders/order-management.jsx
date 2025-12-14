import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = () => {
    try {
      setIsLoading(true);
      // Get orders from antiqueOrders key in localStorage
      const savedOrders = localStorage.getItem('antiqueOrders');
      
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('Orders from antiqueOrders:', parsedOrders);
        
        // Apply filter
        let filteredOrders = parsedOrders;
        if (filterStatus !== 'all') {
          filteredOrders = parsedOrders.filter(order => 
            (order.status || 'Pending').toLowerCase() === filterStatus.toLowerCase()
          );
        }
        
        // Sort by date (newest first)
        filteredOrders.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
          return dateB - dateA;
        });
        
        setOrders(filteredOrders);
      } else {
        console.log('No orders found in antiqueOrders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire('Error', 'Failed to load orders', 'error');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: 'Update Order Status?',
      text: `Change status to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('antiqueOrders') || '[]');
        
        const updatedOrders = savedOrders.map(order => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status: newStatus
            };
          }
          return order;
        });
        
        localStorage.setItem('antiqueOrders', JSON.stringify(updatedOrders));
        
        await Swal.fire('Updated!', 'Order status updated successfully', 'success');
        fetchOrders();
      } catch (error) {
        Swal.fire('Error', 'Failed to update order status', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    switch (statusLower) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatus = (paymentMethod) => {
    const method = (paymentMethod || '').toLowerCase();
    if (method.includes('sadapay') || method.includes('jazzcash')) {
      return 'Paid';
    }
    return 'Pending';
  };

  const getPaymentColor = (paymentMethod) => {
    const method = (paymentMethod || '').toLowerCase();
    if (method.includes('sadapay') || method.includes('jazzcash')) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const viewOrderDetails = (order) => {
    Swal.fire({
      title: `Order #${order.orderId}`,
      html: `
        <div class="text-left space-y-4">
          <div>
            <h3 class="font-semibold text-gray-700 mb-2 border-b pb-1">Customer Information</h3>
            <p class="mb-1"><span class="font-medium">Name:</span> ${order.customer?.name || 'N/A'}</p>
            <p class="mb-1"><span class="font-medium">Email:</span> ${order.customer?.email || 'N/A'}</p>
            <p class="mb-1"><span class="font-medium">Phone:</span> ${order.customer?.phone || 'N/A'}</p>
            <p class="mb-1"><span class="font-medium">Address:</span> ${order.customer?.address || 'N/A'}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-700 mb-2 border-b pb-1">Order Details</h3>
            <p class="mb-1"><span class="font-medium">Order Date:</span> ${order.orderDate || 'N/A'}</p>
            <p class="mb-1"><span class="font-medium">Payment Method:</span> ${order.paymentMethod || 'Cash on Delivery'}</p>
            <p class="mb-1">
              <span class="font-medium">Payment Status:</span> 
              <span class="${getPaymentColor(order.paymentMethod)} px-2 py-1 rounded ml-2 text-xs">
                ${getPaymentStatus(order.paymentMethod)}
              </span>
            </p>
            <p class="mb-1">
              <span class="font-medium">Order Status:</span> 
              <span class="${getStatusColor(order.status)} px-2 py-1 rounded ml-2 text-xs">
                ${order.status || 'Pending'}
              </span>
            </p>
            <p class="mb-1"><span class="font-medium">Estimated Delivery:</span> ${order.estimatedDelivery || 'N/A'}</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-700 mb-2 border-b pb-1">Items (${order.items?.length || 0})</h3>
            ${order.items?.map(item => `
              <div class="border-b pb-2 mb-3">
                <p class="font-medium mb-1">${item.name}</p>
                <div class="flex justify-between text-sm">
                  <span>Quantity: ${item.quantity || 1}</span>
                  <span>Price: Rs. ${item.price?.toFixed(2) || '0.00'}</span>
                  <span>Total: Rs. ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</span>
                </div>
              </div>
            `).join('') || '<p class="text-gray-500">No items</p>'}
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-700 mb-2 border-b pb-1">Order Summary</h3>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. ${order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping:</span>
                <span>Rs. ${order.shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax:</span>
                <span>Rs. ${order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>Rs. ${order.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      `,
      width: '700px',
      showCloseButton: true,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'rounded-xl'
      }
    });
  };

  const deleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('antiqueOrders') || '[]');
        const updatedOrders = savedOrders.filter(order => order.orderId !== orderId);
        localStorage.setItem('antiqueOrders', JSON.stringify(updatedOrders));
        
        await Swal.fire('Deleted!', 'Order has been deleted.', 'success');
        fetchOrders();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete order', 'error');
      }
    }
  };

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-600">Managing orders from antiqueOrders in localStorage</p>
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500 mb-4">Orders are stored in localStorage under key "antiqueOrders"</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Current orders in antiqueOrders: {JSON.parse(localStorage.getItem('antiqueOrders') || '[]').length}</p>
            <p>Click "Add Sample" to create a test order</p>
            <p>Or visit your store to place real orders</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P. Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900 hover:underline"
                      >
                        #{order.orderId}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {order.items?.[0]?.name || 'N/A'}
                        {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs. {order.total?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.paymentMethod?.includes('Cash on Delivery') ? 'COD' : order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentMethod)}`}>
                        {getPaymentStatus(order.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteOrder(order.orderId)}
                        className="text-red-600 hover:text-red-900 ml-2"
                        title="Delete order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {orders.length} of {JSON.parse(localStorage.getItem('antiqueOrders') || '[]').length} order{orders.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm font-medium text-gray-700">
                Total Revenue: Rs. {orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
      
    
    </div>
  );
}