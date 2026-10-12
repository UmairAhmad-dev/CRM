import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getLeads } from '../api/client';
import { 
  Users, TrendingUp, Target, Activity, 
  ArrowUpRight, Plus, ArrowRight, DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const statusConfig = {
  NEW: { color: 'bg-blue-50 text-blue-700 border-blue-200', bar: 'bg-blue-500' },
  CONTACTED: { color: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-400' },
  IN_PROGRESS: { color: 'bg-purple-50 text-purple-700 border-purple-200', bar: 'bg-purple-500' },
  WON: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
  LOST: { color: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-500' },
};

const generateRevenueData = (leads) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dataMap = {};
  
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = months[d.getMonth()];
    dataMap[monthName] = { month: monthName, actual: 0, projected: 0 };
  }

  leads.forEach(lead => {
    const date = new Date(lead.createdAt);
    const monthName = months[date.getMonth()];
    if (dataMap[monthName]) {
      if (lead.status === 'WON') {
        dataMap[monthName].actual += (lead.dealValue || 0);
      } else if (lead.status !== 'LOST') {
        dataMap[monthName].projected += (lead.dealValue || 0);
      }
    }
  });

  return Object.values(dataMap);
};

export default function Dashboard() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  });

  const currentUser = JSON.parse(localStorage.getItem('crm_user') || '{}');
  const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'User';

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="font-medium">Loading executive dashboard...</p>
        </div>
      </div>
    );
  }

  const revenueData = generateRevenueData(leads);
  
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'NEW').length;
  const wonLeads = leads.filter(l => l.status === 'WON').length;
  const activeLeads = leads.filter(l => ['NEW', 'CONTACTED', 'IN_PROGRESS'].includes(l.status)).length;
  const conversionRate = totalLeads === 0 ? 0 : Math.round((wonLeads / totalLeads) * 100);

  const stats = [
    { label: 'Total Pipeline', value: totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%' },
    { label: 'Active Opportunities', value: activeLeads, icon: Target, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+5%' },
    { label: 'Closed Won', value: wonLeads, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+18%' },
    { label: 'Win Rate', value: `${conversionRate}%`, icon: Activity, color: 'text-primary-600', bg: 'bg-primary-100', trend: '+2.4%' },
  ];

  return (
    <div className="space-y-8 pb-8">
      
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {firstName}! 👋</h1>
            <p className="text-slate-300 font-medium max-w-xl">
              You have {newLeads} new leads waiting to be contacted. Your pipeline conversion rate is looking strong this week.
            </p>
          </div>
          <Link to="/leads" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm w-fit">
            <Plus className="h-5 w-5" /> Go to Pipeline
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-white/5">
          <Activity className="h-64 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-emerald-500" /> Revenue Forecast
            </h2>
            <p className="text-sm text-slate-500 mt-1">Actual closed revenue vs projected targets (Last 6 months)</p>
          </div>
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500">
            <option>Last 6 Months</option>
          </select>
        </div>
        
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value >= 1000 ? value / 1000 + 'k' : value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Area type="monotone" dataKey="projected" name="Projected Pipeline" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorProjected)" />
              <Area type="monotone" dataKey="actual" name="Actual Closed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Pipeline Distribution</h2>
          <Link to="/leads" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-8">
          {Object.keys(statusConfig).map(status => {
            const count = leads.filter(l => l.status === status).length;
            const percentage = totalLeads === 0 ? 0 : (count / totalLeads) * 100;
            return (
              <div 
                key={status} 
                style={{ width: `${percentage}%` }} 
                className={`h-full ${statusConfig[status].bar} transition-all duration-500`}
                title={`${status}: ${count}`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {Object.keys(statusConfig).map(status => {
            const count = leads.filter(l => l.status === status).length;
            const config = statusConfig[status];
            return (
              <div key={status} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${config.bar}`}></div>
                  <span className="text-xs font-bold text-slate-500">{status.replace('_', ' ')}</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Recent Lead Activity</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {leads.slice(0, 5).map(lead => {
            const leadInitials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase();
            return (
              <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center border border-slate-200">
                    {leadInitials}
                  </div>
                  <div>
                    <Link to={`/leads/${lead.id}`} className="font-bold text-slate-900 hover:text-primary-600 transition-colors">
                      {lead.firstName} {lead.lastName}
                    </Link>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                      {lead.company || 'No Company'} • {lead.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[lead.status].color}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs font-medium text-slate-400">Added to system</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {leads.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-medium">
              No recent activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}