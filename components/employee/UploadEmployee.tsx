"use client";

import { useState, useRef, use, useEffect } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet } from "lucide-react";
import useToast from "@/hooks/useToast";
import http from "@/lib/http";
import type { DictionaryType } from "@/lib/i18n";
import GlobalModal from "../shared/GlobalModal";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { start } from "repl";

interface UploadEmployeeProps {
  translation: DictionaryType;
  lang: Locale;
}

export function UploadEmployee({ translation, lang }: UploadEmployeeProps) {
  const { modalType, closeModal } = useModalStore();
  const { success: toastSuccess, error: toastError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedData, setExtractedData] = useState<any[]>([]);

  useEffect(() => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
  }, []);

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      const reader = new FileReader();

      reader.onloadstart = () => setUploadProgress(10);

      reader.onload = async (e) => {
        try {
          setUploadProgress(30);
          // Read and parse Excel file
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Convert to JSON with proper date formatting
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: "yyyy-mm-dd",
          });

          // Track extraction progress
          const totalRows = jsonData.length;
          if (totalRows === 0) {
            throw new Error("The uploaded file is empty.");
          }

          let processedRows = 0;
          const progressIncrement = 30 / totalRows; // 30% of total progress for data extraction

          // Map to required format with progress updates
          const employees = jsonData.map((item: any) => {
            const employee = {
              matricule: item["Matricule."],
              date: item["Date."],
              presence: item["Présence réelle."],
            };

            processedRows++;
            setUploadProgress((prev) =>
              Math.min(60, 30 + Math.floor(processedRows * progressIncrement))
            );

            return employee;
          });
          setExtractedData(employees);

          setUploadProgress(60); // Ensure we reach 60% after mapping

          // Send extracted data to backend
          setUploadProgress(70);
          const response = await http(
            `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/history-of-pay`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(employees),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            setUploadProgress(0);
            throw new Error(errorData.message || "Upload failed");
          }

          const resData = await response.json();

          setUploadProgress(100);
          toastSuccess(
            translation.employee.form.Out_of +
              " " +
              (resData?.valid_matricules?.length +
                resData?.invalid_matricules?.length) +
              " " +
              translation.employee.form.employees +
              ", " +
              resData?.valid_matricules?.length +
              " " +
              translation.employee.form["were successfully processed"] +
              ", " +
              translation.employee.form.and +
              " " +
              resData?.invalid_matricules?.length +
              " " +
              translation.employee.form.failed
          );
          closeModal();
          setSelectedFile(null);
          setError(null);
          setUploadProgress(0);
        } catch (err) {
          console.error("Upload error:", err);
          setError(
            (err as Error)?.message || translation.employee.message.upload_error
          );
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError(translation.employee.message.upload_error);
        toastError(translation.employee.message.upload_error);
        setIsUploading(false);
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      setError(translation.employee.message.upload_error);
      toastError(translation.employee.message.upload_error);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Set the new file
      setError(null); // Clear any previous errors
      setUploadProgress(0); // Reset progress
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && [".xlsx", ".xls"].includes(file.name.slice(-4))) {
      setSelectedFile(file);
    }
  };

  return (
    <GlobalModal
      open={modalType === "upload"}
      onClose={() => {
        closeModal();
        setSelectedFile(null);
        setError(null);
        setUploadProgress(0);
      }}
      title={translation.sidebar.users_table.upload_execl}
      submitButtonText={translation.employee.common.upload}
      cancelButtonText={translation.employee.common.cancel}
      onSubmit={handleExcelUpload}
      isLoading={isUploading}
    >
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <FileSpreadsheet className="h-12 w-12 text-blue-500 mb-4" />
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {translation.sidebar.users_table.upload_instructions}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {translation.sidebar.users_table.supported_formats}
              </p>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {uploadProgress}%{" "}
                {translation.sidebar.users_table.upload_complete}
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </GlobalModal>
  );
}
