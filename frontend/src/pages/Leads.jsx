import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, createLead, updateLeadStatus, deleteLead } from '../api/client';
import { Mail, Phone, Plus, Building2, Search, Inbox, AlertCircle, Trash2 } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

const STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'WON', 'LOST'];

const statusConfig = {
  NEW: { color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  CONTACTED: { color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  IN_PROGRESS: { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  WON: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  LOST: { color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

export default function Leads() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  });

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsModalOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  // Enhanced Real-time search filtering
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const lowerQuery = searchQuery.toLowerCase();
    
    return leads.filter(lead => {
      // Combine first and last name so searching full names works seamlessly
      const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
      const company = (lead.company || '').toLowerCase();
      const email = (lead.email || '').toLowerCase();
      
      return fullName.includes(lowerQuery) || 
             company.includes(lowerQuery) || 
             email.includes(lowerQuery);
    });
  }, [leads, searchQuery]);

  const handleDelete = (e, leadId) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      deleteMutation.mutate(leadId);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="font-medium">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="h-6 w-6" />
          <p className="font-medium">Failed to connect to the server. Is your backend running?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your active sales opportunities.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm transition-all"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-medium shadow-sm whitespace-nowrap"
          >
            <Plus className="h-5 w-5" /> 
            Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6 flex-1 snap-x">
        {STATUSES.map((status) => {
          const columnLeads = filteredLeads.filter((lead) => lead.status === status);
          const config = statusConfig[status];

          return (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col snap-start">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`}></div>
                  <h3 className="font-semibold text-slate-800 text-sm tracking-wide">
                    {status.replace('_', ' ')}
                  </h3>
                </div>
                <span className="bg-slate-200/70 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {columnLeads.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="flex flex-col gap-4 flex-1 overflow-y-auto pb-2 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {columnLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => window.location.href = `/leads/${lead.id}`}
                    className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group cursor-pointer hover:border-primary-400 hover:shadow-md transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Delete Button (Visible on Hover) */}
                    <button
                      onClick={(e) => handleDelete(e, lead.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md opacity-0 group-hover:opacity-100 transition-all z-20"
                      title="Delete Lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="mb-3 pr-8">
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-primary-700 transition-colors truncate">
                        {lead.firstName} {lead.lastName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 font-medium truncate">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" /> 
                        <span className="truncate">{lead.company || 'No Company specified'}</span>
                      </div>
                    </div>
                    
                    <div className="relative z-10 mb-4">
                      <select 
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          statusMutation.mutate({ id: lead.id, status: e.target.value });
                        }}
                        className={`w-full text-xs font-bold rounded-md px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none border ${config.color} hover:opacity-80 transition-opacity`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s} className="bg-white text-slate-900">
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 group/email hover:text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-slate-400 group-hover/email:text-slate-700 flex-shrink-0" /> 
                        <span className="truncate">{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-2 group/phone hover:text-slate-700">
                          <Phone className="h-3.5 w-3.5 text-slate-400 group-hover/phone:text-slate-700 flex-shrink-0" /> 
                          <span className="truncate">{lead.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {columnLeads.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400">
                    <Inbox className="h-6 w-6 mb-2 opacity-50" />
                    <span className="text-sm font-medium">No leads</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />
    </div>
  );
}