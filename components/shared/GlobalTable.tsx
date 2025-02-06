"use client";
import {
  ThemeProvider as MTThemeProvider,
  Card,
  Typography,
} from "@material-tailwind/react";
import { ReactNode } from "react";

export interface TableHeader<T> {
  key: keyof T;
  label: string;
  renderCell?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T> {
  headers: Array<TableHeader<T>>;
  rows: T[];
  className?: string;
}

export const GlobalTable = <T extends { id: string | number }>({
  headers,
  rows,
  className,
}: TableProps<T>) => {
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
            {rows.map((row) => (
              <TableRow<T> key={row.id} row={row} headers={headers} />
            ))}
          </tbody>
        </table>
      </Card>
    </MTThemeProvider>
  );
};

interface TableRowProps<T> {
  row: T;
  headers: Array<TableHeader<T>>;
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
