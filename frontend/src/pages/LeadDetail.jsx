import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, getNotes, createNote } from '../api/client';
import { 
  ArrowLeft, Building2, Mail, Phone, User as UserIcon, 
  Clock, Send, AlertCircle, MessageSquare, CalendarDays, CheckCircle2
} from 'lucide-react';

const statusConfig = {
  NEW: { color: 'bg-blue-50 text-blue-700 border-blue-200' },
  CONTACTED: { color: 'bg-amber-50 text-amber-700 border-amber-200' },
  IN_PROGRESS: { color: 'bg-purple-50 text-purple-700 border-purple-200' },
  WON: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  LOST: { color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function LeadDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: lead, isLoading: leadLoading, isError: leadError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id),
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => getNotes(id),
  });

  const noteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
      
      // Trigger inline success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    noteMutation.mutate({ content: newNote, leadId: id, authorId: lead.userId });
  };

  if (leadLoading || notesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="font-medium">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (leadError || !lead) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="h-6 w-6" />
          <p className="font-medium">Lead not found or failed to load.</p>
        </div>
      </div>
    );
  }

  const initials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Enhanced Back Button */}
      <Link 
        to="/leads" 
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200 hover:shadow-sm transition-all group mb-8 w-fit"
      >
        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-primary-600 group-hover:-translate-x-1 transition-all" /> 
        Back to Pipeline
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Polished Lead Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-col items-center text-center relative">
              <div className="h-20 w-20 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm ring-4 ring-white">
                {initials}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {lead.firstName} {lead.lastName}
              </h1>
              <span className={`mt-3 px-3.5 py-1.5 rounded-full text-xs font-bold border ${statusConfig[lead.status].color}`}>
                {lead.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="p-6 space-y-5 text-sm">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Building2 className="h-4 w-4" /></div>
                <span className="font-medium">{lead.company || 'No Company specified'}</span>
              </div>
              
              <div className="flex items-center gap-4 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail className="h-4 w-4" /></div>
                <a href={`mailto:${lead.email}`} className="font-medium hover:text-primary-600 transition-colors truncate">
                  {lead.email}
                </a>
              </div>
              
              {lead.phone && (
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone className="h-4 w-4" /></div>
                  <span className="font-medium">{lead.phone}</span>
                </div>
              )}
              
              <div className="pt-5 mt-2 border-t border-slate-100 flex items-center gap-4 text-slate-600">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-500"><UserIcon className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Assigned Representative</p>
                  <p className="font-medium text-slate-900">{lead.assignedTo?.name || 'Unassigned'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><CalendarDays className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Added On</p>
                  <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Timeline & Notes Input */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            
            <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Log Activity</h2>
            <form onSubmit={handleAddNote} className="mb-10">
              <div className="relative">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log a call, summarize a meeting, or leave a note..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none resize-none transition-all duration-200 text-sm shadow-inner min-h-[120px]"
                  required
                />
              </div>
              <div className="flex justify-between items-center mt-3">
                {/* Inline Success Message */}
                <div className={`flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  Note saved successfully
                </div>

                <button 
                  type="submit" 
                  disabled={noteMutation.isPending || !newNote.trim()} 
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm ml-auto"
                >
                  <Send className="h-4 w-4" />
                  {noteMutation.isPending ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>

            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Activity Timeline</h2>
            
            {notes.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Clock className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No activity logged yet.</p>
                <p className="text-sm text-slate-400 mt-1">Leave a note above to start the timeline.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                {notes.map((note) => (
                  <div key={note.id} className="relative pl-8 group">
                    <div className="absolute -left-[17px] top-1.5 h-8 w-8 rounded-full bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-slate-200 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{note.author?.name}</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Note</span>
                        </div>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {new Date(note.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mt-3">
                        {note.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}