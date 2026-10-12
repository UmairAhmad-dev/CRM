import { useState, useEffect } from 'react';
import { 
  X, User as UserIcon, Mail, Building2, Phone, 
  Briefcase, Loader2, UserPlus, DollarSign 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/client';

export default function AddLeadModal({ isOpen, onClose, onSubmit, isPending }) {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', company: '', email: '', phone: '', userId: '', dealValue: ''
  });

  useEffect(() => {
    if (users.length > 0 && !formData.userId) {
      setFormData(prev => ({ ...prev, userId: users[0].id }));
    }
  }, [users, formData.userId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dealValue: parseInt(formData.dealValue) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">Add New Lead</h2>
              <p className="text-xs text-slate-500 mt-1">Enter the prospect's contact information</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">First Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input required type="text" placeholder="Jane"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Last Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input required type="text" placeholder="Doe"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input required type="email" placeholder="jane@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="tel" placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Company</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" placeholder="Acme Corp"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, company: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Deal Value ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="number" min="0" placeholder="5000"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, dealValue: e.target.value})} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Assign To *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <select 
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a representative...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={isPending || !formData.userId} className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}