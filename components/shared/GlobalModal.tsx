import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner
} from "@material-tailwind/react";
import { X } from "lucide-react";

interface GlobalModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  cancelButtonText: string;
  contentClassName?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  submitButtonText,
  cancelButtonText,
  contentClassName,
  children,
  isLoading
}) => {
  return (
    <Dialog
      open={open}
      handler={onClose}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      className={`bg-background border border-blue-gray-900 p-3 max-h-[94vh] max-w-3xl overflow-hidden ${contentClassName}`}
    >
      <div className="flex justify-between">
        <DialogHeader
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-foreground"
        >
          {title}
        </DialogHeader>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-background text-foreground"
        >
          <X />
        </button>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="flex flex-col gap-4 overflow-y-auto max-h-[73vh]"
        >
          {children}
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="z-10"
        >
          <Button
            variant="text"
            onClick={onClose}
            className="mr-2 text-foreground"
            type="button"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {cancelButtonText}
          </Button>
          <Button
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            type="submit"
            className="bg-primary text-black flex items-center gap-2 justify-center"
            disabled={isLoading}
          >
            {isLoading && <Spinner className="h-4 w-4" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default GlobalModal;
