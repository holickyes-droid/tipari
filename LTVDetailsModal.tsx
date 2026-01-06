import { X, FileText, ExternalLink, Building2, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { LTVDetails } from '../types/project';

interface LTVDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
  projectName: string;
  ltvDetails: LTVDetails;
}

export function LTVDetailsModal({
  isOpen,
  onClose,
  ticketNumber,
  projectName,
  ltvDetails,
}: LTVDetailsModalProps) {
  if (!isOpen) return null;

  const handleViewAppraisal = () => {
    if (ltvDetails.appraisalDocumentUrl) {
      window.open(ltvDetails.appraisalDocumentUrl, '_blank');
    } else {
      console.log('Opening appraisal document...');
      // In real app: open document viewer or download
    }
  };

  const handleVisitWebsite = () => {
    if (ltvDetails.appraiserWebsite) {
      window.open(ltvDetails.appraiserWebsite, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 bg-slate-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-[#215EF8]" />
                <h2 className="text-xl font-semibold text-[#040F2A]">
                  LTV / Posudek
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono font-medium text-[#040F2A]">{ticketNumber}</span>
                <span>•</span>
                <span className="truncate max-w-md">{projectName}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-[#040F2A] transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* LTV Value Display */}
            <div className="text-center py-6 bg-gradient-to-br from-[#215EF8]/5 to-[#14AE6B]/5 rounded-xl border border-[#215EF8]/10">
              <div className="text-sm text-muted-foreground mb-2">
                Loan to Value Ratio
              </div>
              <div className="text-5xl font-bold text-[#215EF8] mb-2">
                {ltvDetails.value}%
              </div>
              <div className="text-xs text-muted-foreground">
                Poměr výše úvěru k hodnotě nemovitosti
              </div>
            </div>

            {/* Appraisal Information - Only show if not "ne" */}
            {ltvDetails.appraisalType !== 'ne' && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Informace o posudku
                </h3>
                
                <div className="bg-white border border-border rounded-lg p-5 space-y-4">
                  {/* Appraisal Type */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1.5">
                      Typ posudku
                    </div>
                    <div className="text-sm text-[#040F2A]">
                      Hodnota LTV byla stanovena na základě{' '}
                      <span className="font-semibold">
                        {ltvDetails.appraisalType === 'externí' ? 'externího' : 'interního'}
                      </span>{' '}
                      znaleckého posudku.
                    </div>
                  </div>

                  {/* Appraiser Information */}
                  {ltvDetails.appraiserName && (
                    <div className="pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-3">
                        Zhotovitel posudku
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#215EF8]/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-[#215EF8]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#040F2A]">
                              {ltvDetails.appraiserName}
                            </div>
                            {ltvDetails.appraiserCompany && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {ltvDetails.appraiserCompany}
                              </div>
                            )}
                          </div>
                        </div>

                        {ltvDetails.appraiserWebsite && (
                          <button
                            onClick={handleVisitWebsite}
                            className="flex items-center gap-2 text-sm text-[#215EF8] hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            {ltvDetails.appraiserWebsite}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Box - Only show if document available */}
            {ltvDetails.appraisalDocumentUrl && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-900 mb-1">
                      Přístup k posudku
                    </div>
                    <div className="text-xs text-amber-700 leading-relaxed">
                      Kompletní znalecký posudek je k dispozici k nahlédnutí. 
                      Dokument obsahuje detailní ocenění nemovitosti a všechny relevantní údaje.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Zavřít
            </Button>
            <Button
              className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
              onClick={handleViewAppraisal}
            >
              <FileText className="w-4 h-4 mr-2" />
              Zobrazit znalecký posudek
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}