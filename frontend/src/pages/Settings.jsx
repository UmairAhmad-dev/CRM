import { useState } from 'react';
import { User, Bell, Shield, Key, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and system settings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isActive ? 'bg-white text-primary-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  UA
                </div>
                <div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm mb-2">
                    Change Avatar
                  </button>
                  <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Full Name</label>
                  <input type="text" defaultValue="Umair Ahmad" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Role</label>
                  <input type="text" defaultValue="Sales Admin" disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email Address</label>
                  <input type="email" defaultValue="umairahmad.dev@gmail.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all shadow-sm">
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'profile' && (
            <div className="h-48 flex items-center justify-center text-slate-400 font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}