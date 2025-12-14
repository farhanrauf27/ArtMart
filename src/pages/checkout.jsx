'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useCart } from '../../context/CartContext';
import { CreditCard, Truck, Shield, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, cartCount, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan',
        paymentMethod: 'cod',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        specialInstructions: ''
    });

    // Calculate totals
    const shippingCost = 0; // Free shipping
    const taxAmount = cartTotal * 0.05;
    const grandTotal = cartTotal + shippingCost + taxAmount;

    // Redirect if cart is empty
    useEffect(() => {
        if (cartCount === 0 && !orderSuccess) {
            router.push('/cart');
        }
    }, [cartCount, router, orderSuccess]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                Swal.fire({
                    title: 'Missing Information',
                    text: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
                    icon: 'warning',
                    confirmButtonColor: '#b45309',
                    background: '#1a1a1a',
                    color: '#fbbf24',
                });
                return false;
            }
        }

        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
                Swal.fire({
                    title: 'Payment Details Required',
                    text: 'Please fill in all card details',
                    icon: 'warning',
                    confirmButtonColor: '#b45309',
                    background: '#1a1a1a',
                    color: '#fbbf24',
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
  
  if (!validateForm()) return;

  setIsProcessing(true);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate order details
  const orderId = 'ANTQ-' + Date.now().toString().slice(-8);
  const orderDate = new Date().toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const orderData = {
    orderId,
    orderDate,
    items: [...cart], // IMPORTANT: Make sure cart has items
    total: grandTotal,
    customer: {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`
    },
    paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Jazzcash/SadaPay',
    status: 'Pending',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    subtotal: cartTotal,
    shipping: shippingCost,
    tax: taxAmount,
    createdAt: new Date().toISOString()
  };

  // DEBUG: Log the order data
  console.log('Saving order to localStorage:', orderData);

  // Save order to localStorage - FIX THIS PART
  try {
    // Get existing orders or create empty array
    const existingOrders = JSON.parse(localStorage.getItem('antiqueOrders') || '[]');
    console.log('Existing orders:', existingOrders);
    
    // Add new order at the beginning
    existingOrders.unshift(orderData);
    
    // Save back to localStorage
    localStorage.setItem('antiqueOrders', JSON.stringify(existingOrders));
    console.log('Order saved successfully! Total orders:', existingOrders.length);
    
    // Verify it was saved
    const verify = JSON.parse(localStorage.getItem('antiqueOrders'));
    console.log('Verified saved orders:', verify);
  } catch (error) {
    console.error('Failed to save order to localStorage:', error);
  }
        // Clear cart after successful order
        clearCart();

        // Show success message
        Swal.fire({
            title: 'Order Confirmed!',
            html: `
        <div class="text-center">
          <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-900 mb-2">Thank you for your order!</h3>
          <p class="text-gray-600 mb-4">Your order #${orderId} has been confirmed.</p>
          <p class="text-sm text-gray-500">We will contact you soon for delivery details.</p>
        </div>
      `,
            confirmButtonColor: '#b45309',
            background: '#ffffff',
            color: '#000000',
            showConfirmButton: true,
            confirmButtonText: 'Continue Shopping',
            allowOutsideClick: false
        }).then(() => {
            router.push('/shop');
        });
    };

    if (orderSuccess && orderDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
                <Navbar />

                <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Order <span className="text-amber-400">Confirmed!</span>
                        </h1>
                        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100 animate-fade-in delay-100">
                            Thank you for your purchase
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
                            <div className="p-8 md:p-12">
                                <div className="text-center mb-10">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h2>
                                    <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Truck className="w-5 h-5 text-amber-600" />
                                                Order Details
                                            </h3>
                                            <div className="space-y-2">
                                                <p><span className="font-medium">Order ID:</span> {orderDetails.orderId}</p>
                                                <p><span className="font-medium">Date:</span> {orderDetails.orderDate}</p>
                                                <p><span className="font-medium">Total:</span> Rs. {orderDetails.total.toFixed(2)}</p>
                                                <p><span className="font-medium">Payment:</span> {orderDetails.paymentMethod}</p>
                                                <p><span className="font-medium">Estimated Delivery:</span> {orderDetails.estimatedDelivery}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-amber-600" />
                                            Customer Information
                                        </h3>
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Name:</span> {orderDetails.customer.name}</p>
                                            <p><span className="font-medium">Email:</span> {orderDetails.customer.email}</p>
                                            <p><span className="font-medium">Phone:</span> {orderDetails.customer.phone}</p>
                                            <p><span className="font-medium">Address:</span> {orderDetails.customer.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-amber-200 pt-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                                    <div className="space-y-4">
                                        {orderDetails.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    {item.picture && (
                                                        <img src={item.picture} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                    )}
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-amber-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center justify-center bg-gradient-to-r from-amber-700 to-amber-800 text-white font-medium py-3 px-8 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <button
                                        onClick={() => window.print()}
                                        className="inline-flex items-center justify-center border border-amber-600 text-amber-700 font-medium py-3 px-8 rounded-lg hover:bg-amber-50 transition-colors"
                                    >
                                        Print Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <Link href="/shop" className="text-amber-600 hover:text-amber-700">
                        Return to shop
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
            <Navbar />

            <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Secure <span className="text-amber-400">Checkout</span>
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100 animate-fade-in delay-100">
                        Complete your purchase with confidence
                    </p>
                </div>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden mb-8">
                                <div className="p-6 border-b border-amber-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Shipping Information</h2>
                                    <p className="text-gray-600">Enter your delivery details</p>
                                </div>

                                <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address *
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Special Instructions
                                        </label>
                                        <textarea
                                            name="specialInstructions"
                                            value={formData.specialInstructions}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="Any special delivery instructions?"
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-amber-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-amber-600" />
                                            Payment Method
                                        </h3>

                                        <div className="space-y-4">


                                            <label className="flex items-center p-4 border-2 border-amber-300 rounded-lg cursor-pointer hover:bg-amber-50 bg-amber-50/50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={formData.paymentMethod === 'cod'}
                                                    onChange={handleInputChange}
                                                    className="mr-3 w-5 h-5 text-amber-600"
                                                />
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900">Cash on Delivery</span>
                                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">Recommended</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">Pay when your order arrives. No extra charges.</p>
                                                </div>
                                                <Truck className="w-6 h-6 text-amber-600" />
                                            </label>

                                            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="mobile"
                                                    checked={formData.paymentMethod === 'mobile'}
                                                    onChange={handleInputChange}
                                                    className="mr-3 w-5 h-5 text-amber-600"
                                                />
                                                <div className="flex-grow">
                                                    <span className="font-bold text-gray-900">Jazzcash / SadaPay</span>
                                                    <p className="text-sm text-gray-600 mt-1">Mobile wallet payment</p>
                                                </div>
                                                <CreditCard className="w-6 h-6 text-gray-600" />
                                            </label>

                                            {formData.paymentMethod === 'mobile' && (
                                                <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="mb-6">
                                                        <h4 className="font-bold text-gray-900 mb-3">Payment Instructions</h4>
                                                        <div className="p-4 bg-white rounded-lg border border-amber-200">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium text-gray-900">Payment Number:</span>
                                                                    <span className="font-bold text-amber-800 text-lg">0303 070 9889</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium text-gray-900">Payment Method:</span>
                                                                    <span className="font-medium text-gray-900">Jazzcash / SadaPay</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium text-gray-900">Amount to Pay:</span>
                                                                    <span className="font-bold text-amber-800 text-xl">Rs. {grandTotal.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                            <p className="text-gray-700 font-medium mb-2">📱 How to Pay:</p>
                                                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                                                                <li>Open your Jazzcash or SadaPay app</li>
                                                                <li>Send payment to <span className="font-semibold">0303 070 9889</span></li>
                                                                <li>Enter amount: <span className="font-semibold">Rs. {grandTotal.toFixed(2)}</span></li>
                                                                <li>Take a screenshot of the payment confirmation</li>
                                                                <li>Upload the screenshot below</li>
                                                            </ol>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-900 mb-3">
                                                            Upload Payment Screenshot *
                                                        </label>
                                                        <div className="space-y-4">
                                                            {/* File Upload Area */}
                                                            <div
                                                                className={`border-2 ${formData.paymentScreenshot ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors`}
                                                                onClick={() => document.getElementById('screenshot-upload').click()}
                                                            >
                                                                <input
                                                                    id="screenshot-upload"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            setFormData(prev => ({ ...prev, paymentScreenshot: file }));
                                                                        }
                                                                    }}
                                                                    className="hidden"
                                                                />

                                                                {formData.paymentScreenshot ? (
                                                                    <div className="space-y-2">
                                                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                                                        </div>
                                                                        <p className="font-medium text-gray-900">Screenshot uploaded!</p>
                                                                        <p className="text-sm text-gray-600">{formData.paymentScreenshot.name}</p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setFormData(prev => ({ ...prev, paymentScreenshot: null }));
                                                                            }}
                                                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-2">
                                                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="font-medium text-gray-900">Click to upload screenshot</p>
                                                                        <p className="text-sm text-gray-600">PNG, JPG or JPEG (Max 5MB)</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Image Preview */}
                                                            {formData.paymentScreenshot && (
                                                                <div className="mt-4">
                                                                    <p className="text-sm font-medium text-gray-900 mb-2">Preview:</p>
                                                                    <div className="relative w-full max-w-xs mx-auto">
                                                                        <img
                                                                            src={URL.createObjectURL(formData.paymentScreenshot)}
                                                                            alt="Payment screenshot preview"
                                                                            className="w-full h-auto rounded-lg border border-gray-300"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Important Note */}
                                                            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <span className="text-amber-800 text-sm font-bold">!</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900 mb-1">Important:</p>
                                                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                                            <li>Payment screenshot is <span className="font-bold text-red-600">required</span> to place order</li>
                                                                            <li>Order will only be processed after payment verification</li>
                                                                            <li>Keep your transaction ID for reference</li>
                                                                            <li>Verification may take 1-2 business hours</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="flex justify-between items-center">
                                <Link
                                    href="/cart"
                                    className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Return to Cart
                                </Link>

                                <button
                                    type="submit"
                                    onClick={handleSubmitOrder}
                                    disabled={isProcessing}
                                    className="bg-gradient-to-r cursor-pointer from-amber-700 to-amber-800 text-white font-medium py-3 px-8 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing Order...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            Place Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 sticky top-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Items ({cartCount})</span>
                                        <span className="font-medium">Rs. {cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">Rs. {taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-amber-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-amber-800">
                                                Rs. {grandTotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Including Rs. {taxAmount.toFixed(2)} in taxes</p>
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Secure Checkout</h4>
                                            <p className="text-sm text-gray-600">
                                                Your payment information is encrypted and secure. We never store your card details.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-900">Order Items</h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {cart.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                {item.picture && (
                                                    <img src={item.picture} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                                )}
                                                <div className="flex-grow">
                                                    <p className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-amber-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}