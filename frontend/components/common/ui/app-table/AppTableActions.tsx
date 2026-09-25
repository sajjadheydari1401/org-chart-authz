import { Eye, Pencil, Trash2 } from "lucide-react";

interface AppTableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AppTableActions({
  onView,
  onEdit,
  onDelete,
}: AppTableActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {onView && (
        <Eye
          size={18}
          aria-label="مشاهده"
          className="cursor-pointer hover:opacity-70"
          onClick={onView}
        />
      )}

      {onEdit && (
        <Pencil
          size={18}
          aria-label="ویرایش"
          className="cursor-pointer hover:opacity-70"
          onClick={onEdit}
        />
      )}

      {onDelete && (
        <Trash2
          size={18}
          aria-label="حذف"
          className="cursor-pointer text-destructive hover:opacity-70"
          onClick={onDelete}
        />
      )}
    </div>
  );
}
