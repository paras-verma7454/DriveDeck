import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState, // Import PaginationState
  OnChangeFn, // Import OnChangeFn
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel, // Import getPaginationRowModel
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRefresh?: () => void;
  loading?: boolean; // New prop for loading state
  // Pagination props
  pageIndex: number;
  pageSize: number;
  pageCount: number; // Total number of pages
  rowCount: number; // Total number of rows
  onPaginationChange: OnChangeFn<PaginationState>; // Updated type
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRefresh,
  loading, // Destructure new loading prop
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Added pagination row model
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: onPaginationChange, // Pass external pagination handler
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: { // Pass external pagination state
        pageIndex,
        pageSize,
      },
    },
    pageCount: pageCount, // Pass total page count to table
    manualPagination: true, // Enable manual pagination
    meta: {
      onRefresh,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {window.location.pathname === "/dashboard/users" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start cursor-pointer">
                {table.getColumn("roleName")?.getFilterValue() ? (
                  <span>
                    {
                      table.getColumn("roleName")?.getFilterValue() as string
                    }{" "}
                    <span className="text-muted-foreground">role</span>
                  </span>
                ) : (
                  "Filter role..."
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={
                  (table.getColumn("roleName")?.getFilterValue() as string) ===
                  "user"
                }
                onCheckedChange={() =>
                  table.getColumn("roleName")?.setFilterValue("user")
                }
              >
                User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={
                  (table.getColumn("roleName")?.getFilterValue() as string) ===
                  "vendor"
                }
                onCheckedChange={() =>
                  table.getColumn("roleName")?.setFilterValue("vendor")
                }
              >
                Vendor
              </DropdownMenuCheckboxItem>
              {(table.getColumn("roleName")?.getFilterValue() as string) && (
                <>
                  <DropdownMenuCheckboxItem
                    onCheckedChange={() =>
                      table.getColumn("roleName")?.setFilterValue(undefined)
                    }
                  >
                    Clear
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto cursor-pointer">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className=" table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="overflow-hidden text-center whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? ( // Check if loading is true
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center w-[calc(100vw-360px)]"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-muted-foreground">Fetching data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="overflow-hidden text-center whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center w-[calc(100vw-360px)]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({rowCount} items)
        </div>
      </div>
    </div>
  );
}