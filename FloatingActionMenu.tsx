import { useState } from 'react';
import { Plus, X, UserPlus, Ticket, Phone, Mail, MessageCircle, FileText } from 'lucide-react';

interface FloatingActionMenuProps {
  onAddInvestor: () => void;
  onCreateReservation: () => void;
  onQuickContact: () => void;
  onNewProject: () => void;
}

export function FloatingActionMenu({ 
  onAddInvestor, 
  onCreateReservation, 
  onQuickContact,
  onNewProject
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const actions = [
    {
      id: 'add-investor',
      label: 'Přidat investora',
      icon: UserPlus,
      color: 'from-[#215EF8] to-[#1B4FD1]',
      hoverColor: 'hover:shadow-[#215EF8]/30',
      onClick: () => handleAction(onAddInvestor),
    },
    {
      id: 'create-reservation',
      label: 'Nová rezervace',
      icon: Ticket,
      color: 'from-[#14AE6B] to-[#0F8F56]',
      hoverColor: 'hover:shadow-[#14AE6B]/30',
      onClick: () => handleAction(onCreateReservation),
    },
    {
      id: 'quick-contact',
      label: 'Rychlý kontakt',
      icon: MessageCircle,
      color: 'from-[#040F2A] to-[#0A1A3F]',
      hoverColor: 'hover:shadow-gray-900/30',
      onClick: () => handleAction(onQuickContact),
    },
    {
      id: 'new-project',
      label: 'Nový projekt',
      icon: FileText,
      color: 'from-[#FF9900] to-[#FF6600]',
      hoverColor: 'hover:shadow-[#FF9900]/30',
      onClick: () => handleAction(onNewProject),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {/* Action Items */}
        <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 group"
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {/* Label Tooltip */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {action.label}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={action.onClick}
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} text-white shadow-lg ${action.hoverColor} hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#215EF8] to-[#1B4FD1] text-white shadow-xl hover:shadow-2xl hover:shadow-[#215EF8]/30 transition-all duration-200 flex items-center justify-center group ${
            isOpen ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
          }`}
          aria-label={isOpen ? 'Zavřít menu' : 'Otevřít quick actions'}
        >
          {isOpen ? (
            <X className="w-7 h-7 transition-transform" />
          ) : (
            <Plus className="w-7 h-7 transition-transform group-hover:rotate-90" />
          )}
        </button>

        {/* Floating Label when closed */}
        {!isOpen && (
          <div className="absolute bottom-20 right-0 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <p className="text-sm font-medium text-gray-900">
              Quick Actions
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Quick Contact Modal Component
interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickContactModal({ isOpen, onClose }: QuickContactModalProps) {
  const [formData, setFormData] = useState({
    type: 'question',
    subject: '',
    message: '',
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Quick contact:', formData);
    alert('Dotaz odeslán! Kontaktujeme vás co nejdříve.');
    onClose();
  };

  const contactTypes = [
    { id: 'question', label: 'Dotaz', icon: MessageCircle },
    { id: 'support', label: 'Technická podpora', icon: Phone },
    { id: 'feedback', label: 'Zpětná vazba', icon: Mail },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#040F2A] to-[#0A1A3F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#215EF8]/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#215EF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Rychlý kontakt</h2>
              <p className="text-sm text-gray-400">Kontaktujte nás s dotazem nebo požadavkem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Contact Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Typ dotazu <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {contactTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      formData.type === type.id
                        ? 'border-[#215EF8] bg-[#215EF8]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      formData.type === type.id ? 'text-[#215EF8]' : 'text-gray-600'
                    }`} />
                    <p className="text-sm font-medium text-gray-900">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Předmět <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
              placeholder="Stručný popis dotazu..."
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Zpráva <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all resize-none"
              placeholder="Podrobný popis vašeho dotazu nebo požadavku..."
              required
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                E-mail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                  placeholder="vas@email.cz"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                  placeholder="+420 123 456 789"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Odpovíme do 24 hodin</p>
              <p className="text-blue-700">
                Náš tým vás kontaktuje co nejdříve. V pracovní době obvykle odpovídáme do 2 hodin.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Odeslat dotaz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}