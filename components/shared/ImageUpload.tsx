"use client";
import { useCallback, useState, useEffect } from "react";
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  File,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  allowMultiple?: boolean;
  className?: string;
  label?: string;
  existingImages?: string[] | null; // Existing images passed as strings
}

const ImageUpload = ({
  onFileChange,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  allowMultiple = false,
  className,
  label,
  existingImages = [],
}: ImageUploadProps) => {
  // Local state for new files
  const [files, setFiles] = useState<File[]>([]);
  // Local state for error and loading state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Local state for existing images (initialized from props)
  const [existingFiles, setExistingFiles] = useState<string[]>(
    existingImages || []
  );

  // If the prop changes, update the local state (optional)
  useEffect(() => {
    setExistingFiles(existingImages || []);
  }, [existingImages]);

  // Combine existing images and new files for display
  const allFiles = [
    ...existingFiles.map((url) => ({ type: "existing", url })),
    ...files.map((file) => ({ type: "new", file })),
  ];

  // onDrop callback to handle new file uploads
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setError(null);
      setIsLoading(true);

      if (fileRejections.length > 0) {
        const errors = fileRejections[0].errors;
        const errorMessages = errors.map((err: any) => {
          if (err.code === "file-too-large") {
            return `File exceeds max size (${maxSize / 1024 / 1024}MB)`;
          }
          if (err.code === "file-invalid-type") {
            return "Invalid file type";
          }
          return err.message;
        });
        setError(errorMessages.join(", "));
        setIsLoading(false);
        return;
      }

      const newFiles = allowMultiple
        ? [...files, ...acceptedFiles].slice(0, maxFiles)
        : acceptedFiles.slice(0, maxFiles);

      setFiles(newFiles);
      onFileChange(newFiles);
      setIsLoading(false);
    },
    [files, maxFiles, allowMultiple, maxSize, onFileChange]
  );

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as { [key: string]: string[] }),
    maxSize,
    multiple: allowMultiple,
  });

  // Updated removeFile function to remove both new and existing files
  const removeFile = (index: number) => {
    // If index falls within existingFiles length, remove from existingFiles state
    if (index < existingFiles.length) {
      // Remove the existing image from state
      const updatedExistingFiles = existingFiles.filter((_, i) => i !== index);
      setExistingFiles(updatedExistingFiles);

      // If only one image is allowed, remove it from formData
      if (!allowMultiple) {
        onFileChange([]); // Update parent state with an empty array
      }
      return;
    }

    // Otherwise, calculate index for new files
    const fileIndex = index - existingFiles.length;
    const newFiles = files.filter((_, i) => i !== fileIndex);
    setFiles(newFiles);
    onFileChange(newFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "group relative border-2 border-dashed rounded-xl p-8 transition-all",
          "hover:border-primary cursor-pointer bg-background",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/30",
          error ? "border-destructive" : ""
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <UploadCloud
              className={cn(
                "h-12 w-12 transition-all",
                isDragActive ? "text-primary" : "text-muted-foreground",
                error ? "text-destructive" : ""
              )}
            />
            {isLoading && (
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <p
              className={cn(
                "font-medium transition-colors",
                isDragActive ? "text-primary" : "text-foreground",
                error ? "text-destructive" : ""
              )}
            >
              {error || label}
            </p>
            <p className="text-sm text-muted-foreground">
              {acceptedTypes.join(", ").replace(/image\//g, "")} • Max{" "}
              {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      </div>

      {allFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allFiles.map((item, index) => (
            <div
              key={"url" in item ? item.url : item.file.name}
              className="relative group border rounded-lg overflow-hidden bg-background"
            >
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-2 top-2 p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/20 transition-colors"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>

              {item.type === "existing" ? (
                <Image
                  src={"url" in item ? item.url : ""}
                  alt="Existing image"
                  width={128}
                  height={128}
                  className="w-full h-32 object-cover"
                  loader={({ src }) => src}
                />
              ) : "file" in item && item.file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(item.file)}
                  alt={item.file.name}
                  width={128}
                  height={128}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32 p-4">
                  <File className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {"file" in item ? item.file.name : ""}
                  </span>
                </div>
              )}

              <div className="p-2 border-t">
                <p className="text-xs font-medium truncate">
                  {item.type === "existing"
                    ? "Uploaded Image"
                    : "file" in item
                    ? item.file.name
                    : ""}
                </p>
                {item.type === "new" && (
                  <p className="text-xs text-muted-foreground">
                    {"file" in item
                      ? (item.file.size / 1024 / 1024).toFixed(2)
                      : "0"}
                    MB
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ImageUpload };
