"use client";
import {
  ThemeProvider as MTThemeProvider,
  Card,
  Typography,
  Button,
  IconButton,
  CardFooter,
} from "@material-tailwind/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PackageSearch,
  FileClock,
} from "lucide-react";
import Image from "next/image";

export interface TableHeader<T> {
  key: keyof T;
  label: string;
  renderCell?: (value: T[keyof T], row: T) => ReactNode;
  isImage?: boolean;
  imageOptions?: React.ImgHTMLAttributes<HTMLImageElement>;
  width?: string;
}

interface TableProps<T> {
  headers: Array<TableHeader<T>>;
  rows: T[];
  totalRows: number;
  className?: string;
  classHead?: string;
  pageSize?: number;
  isLoading?: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  noDataMessage?: string;
  sub_text?: string;
}

export const GlobalTable = <T extends { id: string | number }>({
  headers,
  rows,
  totalRows,
  className,
  classHead,
  pageSize = 10,
  isLoading = false,
  setCurrentPage,
  currentPage,
  noDataMessage,
  sub_text,
}: TableProps<T>) => {
  const totalPages = useMemo(
    () => Math.ceil(totalRows / pageSize),
    [totalRows, pageSize]
  );

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const ELLIPSIS = "...";
    const MAX_VISIBLE_PAGES = 5;

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);
      if (leftBound > 2) pages.push(ELLIPSIS);

      for (let i = leftBound; i <= rightBound; i++) pages.push(i);

      if (rightBound < totalPages - 1) pages.push(ELLIPSIS);
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <MTThemeProvider>
      <Card
        className={`w-full overflow-scroll relative ${className}`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <table className="w-full min-w-max table-auto text-left">
          <thead
            className={`sticky top-0 bg-blue-gray-50 border-b border-gray-300 ${classHead}`}
          >
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key.toString()}
                  className="sticky top-0 border-b border-blue-gray-100 p-4 text-start"
                  style={{
                    background: "inherit",
                    maxWidth: header.width
                  }}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 truncate"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {header.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: totalRows }).map((_, index) => {
                const isLastSkeletonRow = index === pageSize - 1;
                return (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td
                        key={header.key.toString()}
                        className={
                          isLastSkeletonRow
                            ? "p-5 text-start"
                            : "p-5 border-b border-blue-gray-50 text-start"
                        }
                        style={{ maxWidth: header.width }}
                      >
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : !rows || rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="p-12 text-center border-b border-blue-gray-50"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <PackageSearch className="w-12 h-12 text-blue-gray-300" />
                    <div className="space-y-1">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-medium"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {noDataMessage || "No Data Available"}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-60"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {sub_text || "There is no data to display"}
                      </Typography>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const isLast = index === rows.length - 1;
                return (
                  <TableRow<T>
                    key={row.id}
                    row={row}
                    headers={headers}
                    isLast={isLast}
                  />
                );
              })
            )}
          </tbody>
        </table>

        {totalRows > pageSize && (
          <CardFooter
            className="flex items-center justify-between border-t border-blue-gray-50 p-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Button
              variant="outlined"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {generatePageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <IconButton
                      key={index}
                      variant="text"
                      size="sm"
                      disabled
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </IconButton>
                  );
                }
                return (
                  <IconButton
                    key={index}
                    variant={currentPage === page ? "outlined" : "text"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {page}
                  </IconButton>
                );
              })}
            </div>

            <Button
              variant="outlined"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </MTThemeProvider>
  );
};

interface TableRowProps<T> {
  row: T;
  headers: Array<TableHeader<T>>;
  isLast?: boolean;
}

const TableRow = <T extends { id: string | number }>({
  row,
  headers,
  isLast,
}: TableRowProps<T>) => {
  return (
    <tr>
      {headers.map((header) => (
        <td
          key={header.key.toString()}
          className={
            isLast
              ? "p-4 text-start"
              : "p-4 border-b border-blue-gray-50 text-start"
          }
          style={{
            maxWidth: header.width,
            overflow: 'hidden',
          }}
        >
          <TableCell<T> header={header} row={row} />
        </td>
      ))}
    </tr>
  );
};

interface TableCellProps<T> {
  header: TableHeader<T>;
  row: T;
}

const TableCell = <T extends { id: string | number }>({
  header,
  row,
}: TableCellProps<T>) => {
  const value = row[header.key];

  if (header.renderCell) {
    return header.renderCell(value, row);
  }

  if (header.isImage) {
    if (!value) return null;
    return (
      <div className="max-w-full overflow-hidden">
        <Image src={String(value)} alt={header.label} width={20} height={20} />
      </div>
    );
  }

  return (
    <Typography
      variant="small"
      color="blue-gray"
      className="font-normal truncate"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      {String(value)}
    </Typography>
  );
};