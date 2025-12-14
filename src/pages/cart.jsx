'use client';

import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


export default function CartPage() {
//   const { cart, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart,  } = useCart();

    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false);
  
  // Get cart data with defaults
  const cartData = useCart();
  
  // Destructure with proper defaults
  const {
    cart = [],
    cartCount = 0,
    cartTotal = 0,
    removeFromCart = () => {},
    updateQuantity = () => {},
    clearCart = () => {},
    isLoading = false,  // Default to false
    isInitialized = true // Default to true
  } = cartData || {};

  // Show loading state while cart is initializing
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
        <Navbar />
        <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your <span className="text-amber-400">Cart</span>
            </h1>
          </div>
        </section>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      Swal.fire({
        title: 'Remove item?',
        text: 'Do you want to remove this item from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b45309',
        cancelButtonColor: '#374151',
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'Cancel',
        background: '#1a1a1a',
        color: '#fbbf24',
      }).then((result) => {
        if (result.isConfirmed) {
          removeFromCart(productId);
        }
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    Swal.fire({
      title: 'Remove item?',
      text: `Do you want to remove "${productName}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b45309',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      background: '#1a1a1a',
      color: '#fbbf24',
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
      }
    });
  };

  const handleClearCart = () => {
    if (cartCount === 0) return;

    Swal.fire({
      title: 'Clear cart?',
      text: 'Do you want to remove all items from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b45309',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, clear cart',
      cancelButtonText: 'Cancel',
      background: '#1a1a1a',
      color: '#fbbf24',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
      }
    });
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    Swal.fire({
      title: 'Proceed to Checkout?',
      text: `Your order total is Rs. ${cartTotal.toFixed(2)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b45309',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, checkout',
      cancelButtonText: 'Continue shopping',
      background: '#1a1a1a',
      color: '#fbbf24',
    }).then((result) => {
      setIsProcessing(false);
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Checkout Successful!',
          text: 'Thank you for your order. We will contact you soon for delivery details.',
          icon: 'success',
          confirmButtonColor: '#b45309',
          background: '#1a1a1a',
          color: '#fbbf24',
        }).then(() => {
          clearCart();
        });
      }
    });
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
        <Navbar />
        
        <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your <span className="text-amber-400">Cart</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100 animate-fade-in delay-100">
              Your collection awaits
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl p-8 md:p-12 max-w-lg mx-auto shadow-lg border border-amber-200">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Add some antique treasures to your collection!</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-amber-700 to-amber-800 text-white font-medium py-3 px-8 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>

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
            Your <span className="text-amber-400">Cart</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100 animate-fade-in delay-100">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your collection
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
                <div className="p-6 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Your Collection</h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-amber-50">
                  {cart.map((item) => (
                    <div key={item.productId} className="p-6 hover:bg-amber-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.picture ? (
                            <img
                              src={item.picture}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                              <ShoppingBag className="w-8 h-8 text-amber-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                              <p className="text-sm text-amber-700 mb-2">{item.brand || 'Antique'}</p>
                              <p className="text-gray-600 text-sm mb-4">Category: {item.category}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.productId, item.name)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center border border-amber-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                className="p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                className="p-2 text-gray-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-amber-800">
                                Rs. {(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Rs. {item.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-amber-700">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Rs. {(cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-amber-800">
                        Rs. {(cartTotal * 1.05).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Including Rs. {(cartTotal * 0.05).toFixed(2)} in taxes</p>
                  </div>
                </div>

                <button
  onClick={() => router.push('/checkout')}
  disabled={isProcessing}
  className="w-full bg-gradient-to-r cursor-pointer from-amber-700 to-amber-800 text-white font-medium py-4 px-6 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isProcessing ? (
    <span className="flex items-center justify-center ">
      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      Processing...
    </span>
  ) : (
    'Proceed to Checkout'
  )}
</button>

                <div className="mt-6 space-y-4">
                  <Link
                    href="/shop"
                    className="block text-center border border-amber-600 text-amber-700 font-medium py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-gray-900 mb-2">Authenticity Guaranteed</h4>
                    <p className="text-sm text-gray-600">
                      Every antique comes with a certificate of authenticity and detailed provenance.
                    </p>
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