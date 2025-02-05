
interface ActionButtonsProps {
    Id: number;
    onEdit: (userId: number) => void;
    onDelete: (userId: number) => void;
    editText: string;
    deleteText: string;
}

export const ActionButtons = ({
    Id,
    onEdit,
    onDelete,
    editText,
    deleteText,
}: ActionButtonsProps) => (
    <div className="flex gap-2">
        <button
            onClick={() => onEdit(Id)}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
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

