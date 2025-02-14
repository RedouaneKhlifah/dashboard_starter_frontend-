import { Mail, FileText} from 'lucide-react';

interface ActionButtonsProps {
    Id: number;
    onEdit: (userId: number) => void;
    onDelete: (userId: number) => void;
    onEmail?: (userId: number) => void;
    onPdf?: (userId: number) => void;
    onShow?: (userId: number) => void;
    editText: string;
    deleteText: string;
}

export const ActionButtons = ({
    Id,
    onEdit,
    onDelete,
    onEmail,
    onPdf,
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
        {onPdf && (
            <button
                onClick={() => onPdf(Id)}
                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary  hover:bg-primary/20 rounded-lg transition-colors"
                title="Download PDF"
            >
                <FileText size={18} />
            </button>
        )}
       <button
            onClick={() => onEdit(Id)}
            className="px-3 py-1.5 text-xs font-medium bg-green text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
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