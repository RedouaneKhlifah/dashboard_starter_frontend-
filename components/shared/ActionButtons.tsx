import { useState } from "react";
import { Mail, FileText, FileClock, Eye, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  Id: number;
  onEdit?: (userId: number) => void;
  onDelete: (userId: number) => void;
  onEmail?: (userId: number) => void;
  onPrint?: (userId: number) => void;
  onShow?: (userId: number) => void;
  onShowHistory?: (userId: number) => void;
  editText?: string;
  deleteText?: string;
}

export const ActionButtons = ({
  Id,
  onEdit,
  onDelete,
  onEmail,
  onPrint,
  onShowHistory,
  onShow,
  editText,
  deleteText,
}: ActionButtonsProps) => {
  const [isEmailSending, setIsEmailSending] = useState(false);

  const handleEmailClick = async (id: number) => {
    if (!onEmail) return;

    setIsEmailSending(true);
    try {
      await onEmail(id);
    } catch (error) {
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className="flex gap-2">
      {onEmail && (
        <button
          onClick={() => handleEmailClick(Id)}
          disabled={isEmailSending}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            isEmailSending
              ? "bg-yellow-50/80 text-orange-300 cursor-not-allowed"
              : "bg-yellow-50 text-orange-400 hover:bg-yellow-100"
          }`}
          title="Send Email"
        >
          {isEmailSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Mail size={16} />
          )}
        </button>
      )}
      {onPrint && (
        <button
          onClick={() => onPrint(Id)}
          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
          title="Print"
        >
          <FileText size={18} />
        </button>
      )}
      {onShow && (
        <button
          onClick={() => onShow(Id)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Show"
        >
          <Eye size={16} />
        </button>
      )}
      {onShowHistory && (
        <button
          onClick={() => onShowHistory(Id)}
          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
          title="Show History"
        >
          <FileClock size={18} />
        </button>
      )}
      {onEdit && editText && (
        <button
          onClick={() => onEdit(Id)}
          className="px-3 py-1.5 text-xs font-medium bg-blue-gray-50/50 text-blue-500 hover:bg-blue-100/50 rounded-lg transition-colors"
        >
          {editText}
        </button>
      )}
      <button
        onClick={() => onDelete(Id)}
        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
      >
        {deleteText}
      </button>
    </div>
  );
};
