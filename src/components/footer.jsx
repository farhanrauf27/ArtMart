"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black text-amber-100 pt-16 pb-8 px-8 sm:px-16 border-t border-amber-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-amber-600 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-2 bg-gray-900 rounded"></div>
              <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-bold text-xl">
                A
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              <span className="text-amber-400">Antique</span>
              <span className="text-gray-300">Collection</span>
            </h2>
          </div>
          <p className="text-amber-200 leading-6 text-sm">
            Timeless elegance meets premium craftsmanship. Discover our exclusive collection of antique treasures.
          </p>
          <div className="flex space-x-4 mt-6">
            <Link href="#" className="bg-gray-800 p-3 rounded-full text-amber-300 hover:bg-amber-700 hover:text-white transition-all transform hover:scale-110">
              <FaFacebookF className="w-4 h-4" />
            </Link>
            <Link href="#" className="bg-gray-800 p-3 rounded-full text-amber-300 hover:bg-amber-700 hover:text-white transition-all transform hover:scale-110">
              <FaInstagram className="w-4 h-4" />
            </Link>
            <Link href="#" className="bg-gray-800 p-3 rounded-full text-amber-300 hover:bg-amber-700 hover:text-white transition-all transform hover:scale-110">
              <FaTwitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="bg-gray-800 p-3 rounded-full text-amber-300 hover:bg-amber-700 hover:text-white transition-all transform hover:scale-110">
              <FaYoutube className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-white border-l-4 border-amber-500 pl-3">Collections</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Classic Antiques
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Premium Collection
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Limited Editions
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-white border-l-4 border-amber-500 pl-3">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Authenticity Guarantee
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Shipping & Care
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Valuation Services
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Contact Experts
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-white border-l-4 border-amber-500 pl-3">Company</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Our Heritage
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Expert Team
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Privacy & Security
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-amber-300 transition flex items-center group">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-400 text-sm mb-4">Subscribe to our newsletter for exclusive antique finds</p>
          <div className="flex max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 bg-gray-800 border border-amber-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button className="bg-gradient-to-r from-amber-700 to-amber-800 px-6 py-3 text-white font-medium rounded-r-lg hover:from-amber-800 hover:to-gray-900 transition-all">
              Subscribe
            </button>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Antique Collection. All rights reserved.
            <p className="mt-2 text-xs text-gray-500">Authenticity and craftsmanship guaranteed since 1890</p>
          </div>
        </div>
      </div>
    </footer>
  );
}