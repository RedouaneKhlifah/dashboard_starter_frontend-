import { Mail, FileText, FileClock, Eye } from "lucide-react";

interface ActionButtonsProps {
  Id: number;
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
  onEmail?: (userId: number) => void;
  onPrint?: (userId: number) => void;
  onShow?: (userId: number) => void;
  onShowHistory?: (userId: number) => void;
  editText: string;
  deleteText: string;
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
}: ActionButtonsProps) => (
  <div className="flex gap-2">
    {onEmail && (
      <button
        onClick={() => onEmail(Id)}
        className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Send Email"
      >
        <Mail size={16} />
      </button>
    )}
    {onPrint && (
      <button
        onClick={() => onPrint(Id)}
        className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary  hover:bg-primary/20 rounded-lg transition-colors"
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
    <button
      onClick={() => onEdit(Id)}
      className="px-3 py-1.5 text-xs font-medium bg-green text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
    >
      {editText}
    </button>
    <button
      onClick={() => onDelete(Id)}
      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
    >
      {deleteText}
    </button>
  </div>
);
