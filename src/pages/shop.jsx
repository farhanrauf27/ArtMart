import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../app/globals.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/view');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Filter products to only show "Antique" brand
        const antiqueProducts = data.filter(product => 
          product.brand?.toLowerCase() === 'antique'
        );
        setProducts(antiqueProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')]"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-amber-400">Antique</span> Collection
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-amber-100 animate-fade-in delay-100">
            Timeless elegance meets premium craftsmanship
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Antique Brand Tag */}
          <div className="mb-10 text-center">
            <div className="inline-block px-6 py-2 bg-amber-100 border border-amber-300 rounded-full">
              <span className="text-amber-800 font-medium">Exclusively featuring Antique brand products</span>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Antique products available</h3>
                <p className="text-gray-600">Check back soon for our exclusive Antique collection</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;