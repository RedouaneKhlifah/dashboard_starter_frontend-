"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet } from "lucide-react";
import useToast from "@/hooks/useToast";
import http from "@/lib/http";
import type { DictionaryType } from "@/lib/i18n";
import GlobalModal from "../shared/GlobalModal";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";

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

  const handleExcelUpload = async () => {
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
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: "yyyy-mm-dd",
          });

          const employees = jsonData.map((item: any) => {
            let engagementDate;
            try {
              if (typeof item["Engagement Date"] === "string") {
                engagementDate = new Date(item["Engagement Date"]);
              } else {
                engagementDate = item["Engagement Date"];
              }
              if (isNaN(engagementDate.getTime())) {
                throw new Error("Invalid date");
              }
            } catch (err) {
              console.warn(
                `Invalid date format for employee: ${item["Employee ID"]}`
              );
              engagementDate = new Date();
            }

            return {
              employee_id: item["Employee ID"],
              first_name: item["First Name"],
              last_name: item["Last Name"],
              national_id: item["National ID"],
              date_of_engagement: engagementDate.toISOString(),
              monthly_salary: Number(item["Monthly Salary"] || 0),
              price_per_hour: Number(item["Price per Hour"] || 0),
              price_per_day: Number(item["Price per Day"] || 0),
              address: item["Address"],
              city: item["City"],
            };
          });

          setUploadProgress(60);

          const response = await http(
            `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/upload`,
            {
              method: "POST",
              body: JSON.stringify(employees),
              lang,
            }
          );

          if (response.ok) {
            setUploadProgress(100);
            toastSuccess(translation.employee.message.upload_success);
            setTimeout(() => closeModal(), 1000);
          } else {
            const errorData = await response.json();
            setError(
              errorData.message || translation.employee.message.upload_error
            );
            toastError(
              errorData.message || translation.employee.message.upload_error
            );

            if (errorData?.errors) {
              console.error("Validation errors:", errorData.errors);
            }
          }
        } catch (err) {
          console.error("Upload error:", err);
          setError(translation.employee.message.upload_error);
          toastError(translation.employee.message.upload_error);
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
      setSelectedFile(file);
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
