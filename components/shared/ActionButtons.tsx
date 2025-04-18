import { useState } from "react";
import { Mail, FileText, FileClock, Eye, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  Id: number;
  onEdit?: (userId: number) => void;
  onDelete?: (userId: number) => void;
  onDeleteAsync?: (userId: number) => Promise<void>;
  onEmail?: (userId: number) => Promise<void>;
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
  onDeleteAsync,
  onEmail,
  onPrint,
  onShow,
  onShowHistory,
  editText = "Modifier",
  deleteText = "Supprimer",
}: ActionButtonsProps) => {
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleEmailClick = async () => {
    if (!onEmail) return;
    setIsEmailSending(true);
    try {
      await onEmail(Id);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDeleteClick = async () => {
    if (onDeleteAsync) {
      setIsDeleteLoading(true);
      try {
        await onDeleteAsync(Id);
      } finally {
        setIsDeleteLoading(false);
      }
    } else if (onDelete) {
      onDelete(Id);
    }
  };

  return (
    <div className="flex gap-2">
      {onEmail && (
        <button
          onClick={handleEmailClick}
          disabled={isEmailSending}
          title="Send Email"
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            isEmailSending
              ? "bg-yellow-50/80 text-orange-300 cursor-not-allowed"
              : "bg-yellow-50 text-orange-400 hover:bg-yellow-100"
          }`}
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
          title="Print"
          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
        >
          <FileText size={18} />
        </button>
      )}

      {onShow && (
        <button
          onClick={() => onShow(Id)}
          title="Show"
          className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye size={16} />
        </button>
      )}

      {onShowHistory && (
        <button
          onClick={() => onShowHistory(Id)}
          title="Show History"
          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
        >
          <FileClock size={18} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit(Id)}
          className="px-3 py-1.5 text-xs font-medium bg-blue-gray-50/50 text-blue-500 hover:bg-blue-100/50 rounded-lg transition-colors"
        >
          {editText}
        </button>
      )}

      {(onDeleteAsync || onDelete) && (
        <button
          onClick={handleDeleteClick}
          disabled={isDeleteLoading}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            isDeleteLoading
              ? "bg-red-50/80 text-red-300 cursor-not-allowed"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          {isDeleteLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            deleteText
          )}
        </button>
      )}
    </div>
  );
};
