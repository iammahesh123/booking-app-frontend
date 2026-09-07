import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import Button from './Button';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'outline';
  onClick: (selectedItems: T[]) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  totalRecords?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  sortColumn?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (column: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;
  keyExtractor: (item: T, index: number) => string | number;
  emptyMessage?: string;
  emptySubtext?: string;
  emptyAction?: React.ReactNode;
  enableSelection?: boolean;
  bulkActions?: BulkAction<T>[];
  headerRightContent?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  totalRecords = data.length,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sortColumn,
  sortOrder = 'ASC',
  onSort,
  isLoading = false,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  keyExtractor,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your search query or filter options.',
  emptyAction,
  enableSelection = false,
  bulkActions = [],
  headerRightContent,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map((item, idx) => keyExtractor(item, idx)));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectedItems = data.filter((item, idx) =>
    selectedIds.has(keyExtractor(item, idx))
  );

  const isAllSelected =
    data.length > 0 &&
    data.every((item, idx) => selectedIds.has(keyExtractor(item, idx)));

  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < data.length;

  const densityPadding =
    density === 'compact' ? 'py-2 px-3 text-xs' : 'py-3.5 px-4 text-sm';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Filter & Toolbar Bar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 flex-1">
          {onSearchChange !== undefined && (
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Density toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
            <button
              onClick={() => setDensity('comfortable')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                density === 'comfortable'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Comfortable row density"
            >
              Comfortable
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                density === 'compact'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Compact row density"
            >
              Compact
            </button>
          </div>

          {headerRightContent}
        </div>
      </div>

      {/* Bulk Action contextual bar */}
      {enableSelection && selectedIds.size > 0 && (
        <div className="bg-primary-50 px-4 py-2.5 border-b border-primary-100 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {selectedIds.size}
            </span>
            <span>records selected</span>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={action.variant || 'outline'}
                leftIcon={action.icon}
                onClick={() => action.onClick(selectedItems)}
              >
                {action.label}
              </Button>
            ))}
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-gray-500 hover:text-gray-800 underline ml-2"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Table Canvas */}
      <div className="overflow-x-auto min-h-[300px] relative">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50/80 sticky top-0 z-10">
            <tr>
              {enableSelection && (
                <th scope="col" className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isCurrentSort = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`font-semibold text-gray-700 text-xs tracking-wider uppercase select-none ${densityPadding} ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    } ${col.sortable ? 'cursor-pointer hover:bg-gray-100/80 transition-colors' : ''} ${
                      col.className || ''
                    }`}
                    onClick={() => {
                      if (col.sortable && onSort) {
                        onSort(col.key);
                      }
                    }}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end' : ''
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-gray-400">
                          {isCurrentSort ? (
                            sortOrder === 'ASC' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 hover:text-gray-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: pageSize > 8 ? 8 : pageSize }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {enableSelection && (
                    <td className="w-12 px-4 py-4 text-center">
                      <div className="w-4 h-4 bg-gray-200 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className={densityPadding}>
                      <div
                        className="h-4 bg-gray-200 rounded"
                        style={{
                          width: `${Math.floor(Math.random() * 40 + 50)}%`,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-semibold text-gray-800">
                      {emptyMessage}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {emptySubtext}
                    </p>
                    {emptyAction && <div className="mt-4">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              data.map((item, rowIdx) => {
                const rowId = keyExtractor(item, rowIdx);
                const isSelected = selectedIds.has(rowId);

                return (
                  <tr
                    key={rowId}
                    className={`transition-colors hover:bg-gray-50/80 ${
                      isSelected ? 'bg-primary-50/40' : ''
                    }`}
                  >
                    {enableSelection && (
                      <td className="w-12 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          aria-label={`Select row ${rowIdx + 1}`}
                        />
                      </td>
                    )}

                    {columns.map((col) => {
                      const cellContent = col.render
                        ? col.render(item, rowIdx)
                        : (item as any)[col.key];

                      return (
                        <td
                          key={col.key}
                          className={`text-gray-700 ${densityPadding} ${
                            col.align === 'center'
                              ? 'text-center'
                              : col.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          } ${col.className || ''}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            Showing{' '}
            <span className="font-semibold text-gray-800">
              {totalRecords === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-800">
              {Math.min(page * pageSize, totalRecords)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-800">
              {totalRecords}
            </span>{' '}
            entries
          </span>

          {onPageSizeChange && (
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:ring-primary focus:border-primary font-medium"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>per page</span>
            </div>
          )}
        </div>

        {onPageChange && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="h-8 px-2.5 text-xs"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} className="mr-1" />
              Prev
            </Button>

            <span className="px-3 py-1 text-xs font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="h-8 px-2.5 text-xs"
              aria-label="Next page"
            >
              Next
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
