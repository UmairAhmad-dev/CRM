import { Book, MessageCircle, FileText, ExternalLink, Search } from 'lucide-react';

export default function HelpCenter() {
  const resources = [
    { title: 'Getting Started Guide', desc: 'Learn the basics of navigating the CRM.', icon: Book, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pipeline Management', desc: 'How to efficiently move leads to Closed Won.', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Contact Support', desc: 'Chat with our technical engineering team.', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-gradient-to-br from-primary-900 to-slate-900 rounded-3xl p-10 text-center text-white shadow-lg mb-10 relative overflow-hidden">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 relative z-10">How can we help you?</h1>
        <div className="max-w-xl mx-auto relative z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documentation, articles, and FAQs..." 
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Quick Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div key={res.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className={`h-12 w-12 rounded-xl ${res.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <res.icon className={`h-6 w-6 ${res.color}`} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{res.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{res.desc}</p>
            <span className="text-sm font-semibold text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn more <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}