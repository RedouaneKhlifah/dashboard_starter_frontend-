import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { X } from "lucide-react";

interface GlobalModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  cancelButtonText: string;
  children: React.ReactNode;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  submitButtonText,
  cancelButtonText,
  children,
}) => {
  return (
    <Dialog
      open={open}
      handler={onClose}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      className="bg-background border border-blue-gray-900 p-3 max-h-[94vh] max-w-3xl overflow-hidden"
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
      <form onSubmit={onSubmit}>
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
            className="bg-primary text-black"
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default GlobalModal;
