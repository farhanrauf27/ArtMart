"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Menu, X, ShoppingCart, Package } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  
  // Safe cart count function
  const getSafeCartCount = () => {
    try {
      const { cartCount } = useCart();
      return cartCount || 0;
    } catch {
      return 0;
    }
  };
  
  const cartCount = getSafeCartCount();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out? This will end your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
      background: '#1a1a1a',
      color: '#fbbf24',
      confirmButtonColor: '#b45309',
      cancelButtonColor: '#374151'
    }).then((result) => {
      setUser(null);
      setDropdownOpen(false);
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        router.push("/");
      }
    });
  };

  const navItems = [
    {
      name: "Collections",
      subItems: ["Classic Antiques", "Premium Collection", "Limited Editions", "New Arrivals"],
    },
    {
      name: "Categories",
      subItems: ["Furniture", "Artwork", "Jewelry", "Timepieces"],
    },
    {
      name: "Services",
      subItems: ["Valuation", "Restoration", "Authentication", "Consultation"],
    },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 text-white shadow-lg sticky top-0 z-50 border-b border-amber-700">
      <div className="mx-auto w-full max-w-[100vw] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <div 
            className="flex flex-shrink-0 items-center cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-amber-600 rounded-lg transform rotate-45"></div>
                <div className="absolute inset-1 bg-gray-900 rounded"></div>
                <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-bold text-xl">
                  A
                </span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent tracking-tight">
                Antique<span className="italic font-extrabold">Collection</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            {navItems.map((item, index) => (
              <div 
                key={index} 
                className="relative"
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button className="flex items-center whitespace-nowrap px-1 text-sm font-medium text-amber-100 hover:text-amber-300 transition-colors lg:text-[15px]">
                  {item.name}
                  <svg
                    className="ml-1 h-4 w-4 transition-transform duration-200"
                    style={{
                      transform: hoveredItem === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Navigation Dropdown */}
                {item.subItems && (
                  <div
                    className={`absolute left-0 top-full mt-2 w-56 origin-top rounded-lg bg-gray-900 border border-amber-700 py-2 shadow-xl transition-all duration-200 ${
                      hoveredItem === index
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-95 opacity-0"
                    }`}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href="#"
                        className="block px-4 py-2.5 text-sm text-amber-100 hover:bg-amber-800 hover:text-white transition-colors"
                      >
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Orders Icon (Only show when user is logged in) */}
            {user && (
              <Link
                href="/orders"
                className="relative p-2 text-amber-100 hover:text-amber-300 transition-colors"
                title="My Orders"
              >
                <Package className="h-6 w-6" />
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-amber-100 hover:text-amber-300 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hidden md:flex items-center space-x-2 focus:outline-none cursor-pointer group"
                >
                  <span className="text-sm font-medium text-amber-100 group-hover:text-amber-300 transition-colors">
                    {user.firstName || user.given_name || user.name || 'Collector'}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white ring-2 ring-amber-500/50">
                    {(user?.firstName?.charAt(0) ||
                      user?.given_name?.charAt(0) ||
                      user?.name?.charAt(0) ||
                      'C').toUpperCase()}
                  </div>
                </button>

                {/* User Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-gray-900 border border-amber-700 py-2 shadow-xl">
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-left text-sm text-amber-100 hover:bg-amber-800 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        My Orders
                      </div>
                    </Link>
                    <div className="border-t border-amber-700 my-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm text-amber-100 hover:bg-amber-800 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden space-x-3 md:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-amber-100 hover:text-amber-300 transition-colors border border-amber-600 hover:border-amber-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-800 hover:to-gray-900 transition-all"
                >
                  Join Collection
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-amber-100 hover:bg-amber-800/30 focus:outline-none md:hidden border border-amber-700"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 h-full w-3/4 max-w-xs bg-gradient-to-b from-gray-900 to-black border-l border-amber-800 shadow-xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-800 px-6 py-5">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-amber-600 rounded-lg transform rotate-45"></div>
                  <div className="absolute inset-1 bg-gray-900 rounded"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-bold">
                    A
                  </span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Antique
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-1 text-amber-300 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 py-6">
              {navItems.map((item, index) => (
                <div key={index} className="mb-6">
                  <div className="mb-3 flex items-center text-lg font-medium text-amber-300 border-l-4 border-amber-500 pl-3">
                    {item.name}
                  </div>
                  <div className="ml-3 space-y-2 border-l border-amber-800/50 pl-3">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href="#"
                        className="block py-2.5 text-sm text-amber-200 hover:text-amber-300 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Orders Link (only when logged in) */}
            {user && (
              <div className="px-6 py-4 border-t border-amber-800">
                <Link
                  href="/orders"
                  className="flex items-center space-x-3 text-amber-100 hover:text-amber-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span>My Orders</span>
                </Link>
              </div>
            )}

            {/* Mobile Cart Link */}
            <div className="px-6 py-4 border-t border-amber-800">
              <Link
                href="/cart"
                className="flex items-center space-x-3 text-amber-100 hover:text-amber-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Shopping Cart</span>
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {user ? (
              <div className="mt-auto border-t border-amber-800 p-4">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white">
                    {(user?.firstName?.charAt(0) || 'C').toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-amber-100">{user.firstName}</div>
                    <div className="text-sm text-amber-200/80">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 px-4 py-3 text-sm font-medium text-white hover:from-amber-800 hover:to-gray-900 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-auto flex flex-col space-y-3 border-t border-amber-800 p-4">
                <Link
                  href="/login"
                  className="rounded-lg border border-amber-600 px-4 py-3 text-center text-sm font-medium text-amber-100 hover:bg-amber-800/30 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 px-4 py-3 text-center text-sm font-medium text-white hover:from-amber-800 hover:to-gray-900 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Collection
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}