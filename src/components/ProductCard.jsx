import '../app/globals.css';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const cartData = useCart(); // Get cart data safely

const { 
    addToCart = () => {}, 
    isInitialized = true // Default to true so it doesn't block
  } = cartData || {};
  const openQuickView = () => setIsQuickViewOpen(true);
  const closeQuickView = () => setIsQuickViewOpen(false);

  // In the handleAddToCart function in ProductCard.js
const handleAddToCart = () => {
  if (!isInitialized) {
    Swal.fire({
      title: 'Loading...',
      text: 'Cart is initializing, please wait a moment',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      background: '#1a1a1a',
      color: '#fbbf24',
      toast: true,
      position: 'top-end',
    });
    return;
  }
  
  addToCart(product);
  Swal.fire({
    title: 'Added to Cart!',
    text: `${product.name} has been added to your cart.`,
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
    background: '#1a1a1a',
    color: '#fbbf24',
    toast: true,
    position: 'top-end',
  });
};

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-50 hover:border-amber-200">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {product.isNew && (
          <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            NEW
          </span>
        )}
        {product.rating > 4.5 && (
          <span className="bg-gray-800 text-amber-100 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            PREMIUM
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.picture}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick View Button */}
        <button 
          onClick={openQuickView}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-amber-100 font-medium py-2.5 px-6 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-amber-700 hover:text-white border border-amber-600"
        >
          Quick View
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
              {product.brand || 'Antique'}
            </p>
            <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{product.name}</h3>
          </div>
          <span className="font-bold text-amber-800 text-xl">Rs. {product.price}</span>
        </div>
        
        {/* Rating */}
        

        <button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-gray-900 text-white py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          Add to Cart
        </button>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-200 shadow-2xl">
            <button 
              onClick={closeQuickView}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-900 text-amber-100 z-10 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="sticky top-0">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.picture}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                    {product.brand || 'Antique'}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h2>
                </div>

                <div className="flex items-center mb-6">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(4) ? 'fill-current' : 'fill-none'}`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-3">{product.rating} ({50} reviews)</span>
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">Rs. {product.price}</p>
                  <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

              

                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      handleAddToCart();
                      closeQuickView();
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3.5 px-6 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all duration-300 font-medium shadow-md"
                  >
                    Add to Cart
                  </button>
                  <button className="flex-1 border border-amber-300 text-gray-700 py-3.5 px-6 rounded-lg hover:bg-amber-50 transition-all duration-300 font-medium">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;