"use client";
import {
  ThemeProvider as MTThemeProvider,
  Card,
  Typography,
  Button,
  IconButton,
  CardFooter
} from "@material-tailwind/react";
import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface TableHeader<T> {
  key: keyof T;
  label: string;
  renderCell?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T> {
  headers: Array<TableHeader<T>>;
  rows: T[];
  className?: string;
  pageSize?: number;
  loading?: boolean;
}

export const GlobalTable = <T extends { id: string | number }>({
  headers,
  rows,
  className,
  pageSize = 10,
  loading = false,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = rows.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = rows.slice(startIndex, endIndex);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const ELLIPSIS = '...';
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
        className={`h-full w-full overflow-scroll ${className}`}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key.toString()}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-start"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
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
            {loading ? (
              Array.from({ length:  5 }).map((_, index) => {
                const isLastSkeletonRow = index === pageSize - 1
                return (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td
                        key={header.key.toString()}
                        className={
                          isLastSkeletonRow
                            ? "p-4 text-start"
                            : "p-4 border-b border-blue-gray-50 text-start"
                        }
                      >
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                )
              })
            ) : (
              paginatedRows.map((row, index) => {
                const isLast = index === paginatedRows.length - 1
                return (
                  <TableRow<T>
                    key={row.id}
                    row={row}
                    headers={headers}
                    isLast={isLast}
                  />
                )
              })
            )}
          </tbody>
        </table>

        {totalItems > pageSize && (
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
}: TableRowProps<T>) => {
  const isLast = false;

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

  return (
    <>
      {header.renderCell ? (
        header.renderCell(value, row)
      ) : (
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {String(value)}
        </Typography>
      )}
    </>
  );
};
