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
import { urlToFile } from "@/lib/utils";

interface ImageUploadProps {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  allowMultiple?: boolean;
  className?: string;
  label?: string;
  existingImages?: string[] | null;
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
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingFiles, setExistingFiles] = useState<string[]>(
    existingImages || []
  );

  // Convert existing image URLs to Files when component mounts or existingImages changes
  useEffect(() => {
    const convertUrlsToFiles = async () => {
      if (!existingImages?.length) return;

      setIsLoading(true);
      try {
        const convertedFiles = await Promise.all(
          existingImages.map(async (url) => {
            try {
              return await urlToFile(url, `image-${Date.now()}.png`);
            } catch (err) {
              console.error("Error converting URL to File:", err);
              return null;
            }
          })
        );

        const validFiles = convertedFiles.filter(
          (file): file is File => file !== null
        );
        setFiles(validFiles);
        onFileChange(validFiles);
      } catch (err) {
        console.error("Error converting existing images:", err);
        setError("Failed to load existing images");
      } finally {
        setIsLoading(false);
      }
    };

    convertUrlsToFiles();
  }, [existingImages, onFileChange]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as { [key: string]: string[] }),
    maxSize,
    multiple: allowMultiple,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
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

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="relative group border rounded-lg overflow-hidden bg-background"
            >
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-2 top-2 p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/20 transition-colors"
              >
                <X className="h-4 w-4 text-destructive" />
              </button>

              {file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={128}
                  height={128}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32 p-4">
                  <File className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {file.name}
                  </span>
                </div>
              )}

              <div className="p-2 border-t">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
