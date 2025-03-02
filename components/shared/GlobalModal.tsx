import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
  ThemeProvider,
} from "@material-tailwind/react";
import { X } from "lucide-react";

const customTheme = {
  dialog: {
    styles: {
      base: {
        backdrop: {
          backdropFilter: "backdrop-blur-sm",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
};

interface GlobalModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  onSecondarySubmit?: (e: React.FormEvent) => void;
  secondarySubmitButtonText?: string;
  cancelButtonText: string;
  contentClassName?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  isSecondLoading?: boolean;
  dismiss?: boolean;
  backdrop?: boolean;
  isSecondaryBtnVisible?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  submitButtonText,
  onSecondarySubmit,
  secondarySubmitButtonText,
  isSecondaryBtnVisible,
  cancelButtonText,
  children,
  isLoading,
  isSecondLoading,
  contentClassName,
  dismiss = true,
  backdrop = true,
}) => {
  return (
    <ThemeProvider value={!backdrop && customTheme}>
      <Dialog
        open={open}
        handler={onClose}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className={`bg-background border border-blue-gray-900 p-3 max-h-[94vh] max-w-3xl overflow-hidden !backdrop-blur-none  ${contentClassName}`}
        dismiss={{ enabled: dismiss }}
      >
        <div className="flex justify-between ">
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
        <form noValidate>
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
            {submitButtonText && (
            <Button
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={onSubmit}
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner
                  className="h-4 w-4"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ) : (
                submitButtonText
              )}
            </Button>
          )}

            {isSecondaryBtnVisible && (
              <Button
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                type="submit"
                className="bg-primary ml-2 text-white hover:bg-primary/90 transition-colors"
                disabled={isLoading}
                onClick={onSecondarySubmit}
              >
                {isSecondLoading ? (
                  <Spinner
                    className="h-4 w-4"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                ) : (
                  secondarySubmitButtonText
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </Dialog>
    </ThemeProvider>
  );
};

export default GlobalModal;
