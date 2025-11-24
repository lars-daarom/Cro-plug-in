import React from 'react';
import { LayoutDashboard, Beaker, Settings, PieChart, Layers, Bell, UserCircle } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-20 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">W</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">WP A/B Master</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">Main</div>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg group transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors">
                        <Beaker className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        <span className="font-medium">Experiments</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors">
                        <Layers className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        <span className="font-medium">Segments</span>
                    </a>

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-8">Analytics</div>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors">
                        <PieChart className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        <span className="font-medium">Reports</span>
                    </a>

                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-8">Config</div>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors">
                        <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        <span className="font-medium">Settings</span>
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
                        <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
                        <p className="text-xs text-indigo-100 mb-3">Get unlimited experiments and AI insights.</p>
                        <button className="w-full bg-white/20 hover:bg-white/30 text-xs font-semibold py-1.5 rounded transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                <UserCircle className="w-full h-full text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Admin User</span>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;