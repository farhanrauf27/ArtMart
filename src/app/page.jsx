'use client';

import Image from "next/image";
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    setIsLoggedIn(!!savedUser);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-gray-100 flex flex-col">
      <Navbar/>

      {/* Hero Section */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between min-h-screen py-12 px-4 sm:px-8 md:px-12 bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 text-white overflow-hidden isolate">
        {/* Animated background elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl animate-float-fast" />

        {/* Content */}
        <div className="relative z-10 lg:w-1/2 max-w-2xl mt-8 lg:mt-0 space-y-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            {!isLoggedIn ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-100 animate-text-shimmer">
                Discover Timeless Treasures
              </span>
            ) : (
              <span className="inline-block">
                Welcome Back, <span className="text-amber-300">Collector</span>
              </span>
            )}
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-amber-100/90 leading-relaxed">
            {isLoggedIn
              ? "Continue your journey through our exclusive collection of antique masterpieces."
              : (
                <>
                  Curated collection of <span className="font-medium text-white">authentic antiques</span> and<br />
                  <span className="underline decoration-amber-300">historical artifacts</span> from around the world.
                </>
              )
            }
          </p>

          <div className="flex flex-wrap gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/shop"
                  className="relative overflow-hidden group bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold py-3 px-8 rounded-full hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                </Link>
                <Link
                  href="/signup"
                  className="relative overflow-hidden group bg-transparent border-2 border-amber-300/50 text-amber-100 font-semibold py-3 px-8 rounded-full hover:bg-amber-800/30 hover:border-amber-300 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  <span className="relative z-10">Join Collection</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            ) : (
              <Link
                href="/shop"
                className="relative overflow-hidden group bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold py-3 px-8 rounded-full hover:from-amber-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10">Browse Collection</span>
                <span className="absolute inset-0 bg-gradient-to-r from-amber-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
              </Link>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="relative lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg aspect-square">
            <Image
              src="/art1.png"
              alt="Antique Collection"
              fill
              className="object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-gray-900/10 rounded-full blur-xl -z-10" />
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section id="products" className="py-16 px-8 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-2 text-gray-900">Featured Collection</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Handpicked antique treasures with rich history and exceptional craftsmanship</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center border border-amber-100 hover:border-amber-300 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-full h-72 overflow-hidden mb-4 rounded-lg bg-gray-50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/mirror1.jpeg" 
                  alt="Antique Mirror" 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-full rounded-lg" 
                />
              </motion.div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">Antique Mirror</h4>
              <p className="text-gray-600 mb-4 text-sm">Antique Baroque Oval Gilded Mirror</p>
              <button 
                className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3 px-4 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all cursor-pointer font-medium"
                onClick={() => router.push('/shop')}
              >
                View Details
              </button>
            </motion.div>

            {/* Product 2 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center border border-amber-100 hover:border-amber-300 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="w-full h-72 overflow-hidden mb-4 rounded-lg bg-gray-50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/lamp3.jpeg" 
                  alt="Ornate Gold Genie Lamp" 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-full rounded-lg" 
                />
              </motion.div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">Ornate Gold Genie Lamp</h4>
              <p className="text-gray-600 mb-4 text-sm">Royal Aladdin Brass Genie Lamp</p>
              <button 
                className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3 px-4 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all cursor-pointer font-medium"
                onClick={() => router.push('/shop')}
              >
                View Details
              </button>
            </motion.div>

            {/* Product 3 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center border border-amber-100 hover:border-amber-300 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div 
                className="w-full h-72 overflow-hidden mb-4 rounded-lg bg-gray-50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/watch1.jpeg" 
                  alt="Pocket Watch" 
                  width={300} 
                  height={300} 
                  className="object-cover w-full h-full rounded-lg" 
                />
              </motion.div>
              <h4 className="font-bold text-xl text-gray-900 mb-2">Pocket Watch</h4>
              <p className="text-gray-600 mb-4 text-sm">Regal Timekeeper Pocket Watch</p>
              <button 
                className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3 px-4 rounded-lg hover:from-amber-800 hover:to-gray-900 transition-all cursor-pointer font-medium"
                onClick={() => router.push('/shop')}
              >
                View Details
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-8 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-amber-700">Heritage</span>
              </h3>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                For over a century, we've dedicated ourselves to preserving and sharing the world's most exquisite antique treasures. 
                Each piece in our collection tells a unique story, crafted by master artisans of their time.
              </p>
              <p className="text-gray-600 mb-8">
                Our experts meticulously authenticate and restore every item, ensuring you receive not just an antique, 
                but a piece of history with guaranteed authenticity and exceptional craftsmanship.
              </p>
              <Link
                href="#"
                className="inline-flex items-center text-amber-700 font-medium hover:text-amber-800 transition-colors"
              >
                Learn about our authentication process
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/art2.png"
                  alt="Antique Collection Display"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-amber-200 max-w-xs">
                <h4 className="font-bold text-gray-900 mb-2">Authenticity Guaranteed</h4>
                <p className="text-sm text-gray-600">Every antique comes with a certificate of authenticity and detailed provenance.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}