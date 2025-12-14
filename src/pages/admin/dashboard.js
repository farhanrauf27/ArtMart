import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AddProductPage from '../../components/Products/add-product';
import AllUsers from '../../components/Products/AllUsers';
import ViewProducts from '../../components/Products/view-products';           
import Settings from '../../components/Settings';
import OrderManagement from '../../components/Orders/order-management';
import Swal from 'sweetalert2';


export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch('/api/admin/protected');
        if (!response.ok) {
          router.push('/admin/login');
        } else {
          const data = await response.json();
          setAdmin(data.admin);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmin();
  }, [router]);



const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout!',
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      if (response.ok) {
        await Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      Swal.fire('Error', 'Logout failed. Please try again.', 'error');
    }
  }
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Control Panel</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        {/* Vertical Navbar */}
        <nav className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white shadow-xl">
          <div className="p-6 border-b border-indigo-600">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-indigo-200 text-sm mt-1">Welcome back, {admin?.username}</p>
          </div>

          <div className="p-4 space-y-1">
            <NavItem 
              icon={
                <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              text="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              text="Add a Product"
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            />
            <NavItem 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              text="Products"
              active={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
            />

            <NavItem 
  icon={
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  }
  text="Orders"
  active={activeTab === 'orders'}
  onClick={() => setActiveTab('orders')}
/>


            <NavItem 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              text="Users"
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
            
            <NavItem 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              text="Settings"
              active = {activeTab === 'settings'  && <Settings admin={admin} />}
              onClick={() => setActiveTab('settings')}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600 w-64">
  <button
    onClick={handleLogout}
    className="flex items-center px-4 py-3 text-left rounded-lg hover:bg-indigo-600 transition-colors text-red-100 hover:text-white w-50 cursor-pointer"
  >
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
    Logout
  </button>
</div>

        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                    {admin?.username?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="rounded-xl shadow-sm p-4">
              {activeTab === 'dashboard' && (
                <DashboardContent admin={admin} />
              )}
              {activeTab === 'products' && (
                <AddProductPage/>
              )}
              {activeTab === 'users' && (
                <div><AllUsers/></div>
              )}
              {activeTab === 'orders' && (
  <div><OrderManagement /></div>
)}
              {activeTab === 'analytics' && (
                <div><ViewProducts/></div>
              )}
              {activeTab === 'settings' && (
                <div><Settings admin={admin} /></div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// NavItem Component
const NavItem = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition-colors cursor-pointer ${active ? 'bg-indigo-600 text-white' : 'text-indigo-100 hover:bg-indigo-600/50 hover:text-white'}`}
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </button>
);

// Dashboard Content Component
const DashboardContent = ({ admin }) => (
  
  <div>
    <h2 className="text-xl font-semibold mb-6 text-gray-800 px-8 py-4">Welcome back, {admin.username}!</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-8">
      <StatCard 
        title="Total Products" 
        value="1,248" 
        change="+12%"
        icon={
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
      <StatCard 
        title="Active Users" 
        value="5,342" 
        change="+5.2%"
        icon={
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />
      <StatCard 
        title="Revenue" 
        value="$28,745" 
        change="+8.1%"
        icon={
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>

    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-medium text-gray-700 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start pb-4 border-b border-gray-200 last:border-0">
            <div className="bg-indigo-100 p-2 rounded-lg mr-4">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">New order received #ORD-00{item * 245}</p>
              <p className="text-sm text-gray-500">2{item} minutes ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// StatCard Component
const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change} from last month
        </p>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);