import { Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'success', title: 'System Updated', desc: 'CRM Pro has been successfully updated to version 2.0.', time: '2 hours ago', unread: true },
    { id: 2, type: 'alert', title: 'New Lead Assigned', desc: 'A new lead from the marketing campaign was assigned to you.', time: '5 hours ago', unread: true },
    { id: 3, type: 'info', title: 'Daily Report', desc: 'Your pipeline summary for yesterday is ready to view.', time: '1 day ago', unread: false },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 mt-1">Stay updated on your pipeline and system alerts.</p>
        </div>
        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${notif.unread ? 'bg-primary-50/30' : ''}`}>
              <div className="mt-1">
                {notif.type === 'success' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                {notif.type === 'alert' && <AlertCircle className="h-6 w-6 text-primary-500" />}
                {notif.type === 'info' && <Bell className="h-6 w-6 text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h3>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <Clock className="h-3 w-3" /> {notif.time}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{notif.desc}</p>
              </div>
              {notif.unread && (
                <div className="flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}