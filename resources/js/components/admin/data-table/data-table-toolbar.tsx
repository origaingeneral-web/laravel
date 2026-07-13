import { ChevronDown, FileDown, Search, Upload, X } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { DataTableBulkAction, DataTableBulkActionGroup, DataTableFilter, DataTableMenuOption } from './types';

type DataTableToolbarProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: DataTableFilter[];
    selectedCount?: number;
    selectedIds?: Array<string | number>;
    onClearSelection?: () => void;
    bulkActions?: DataTableBulkAction[];
    bulkActionGroups?: DataTableBulkActionGroup[];
    exportOptions?: DataTableMenuOption[];
    importOptions?: DataTableMenuOption[];
    onImportFile?: (file: File) => void;
    importAccept?: string;
    showExport?: boolean;
    showImport?: boolean;
    trailing?: ReactNode;
};

export function DataTableToolbar({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search rows',
    filters = [],
    selectedCount = 0,
    selectedIds = [],
    onClearSelection,
    bulkActions = [],
    bulkActionGroups = [],
    exportOptions = [],
    importOptions = [],
    onImportFile,
    importAccept = '.csv,.xlsx',
    showExport = true,
    showImport = true,
    trailing,
}: DataTableToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showImportMenu, setShowImportMenu] = useState(false);
    const hasSelection = selectedCount > 0;

    const allImportOptions = [
        ...importOptions,
        ...(onImportFile
            ? [
                  {
                      id: 'upload-file',
                      label: 'Upload',
                      icon: <Upload className="size-4 text-green-600" />,
                      onClick: () => fileInputRef.current?.click(),
                  },
              ]
            : []),
    ];

    const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !onImportFile) {
            return;
        }

        await onImportFile(file);
        event.target.value = '';
    };

    return (
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        placeholder={searchPlaceholder}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    {hasSelection && (
                        <div className="flex flex-wrap items-center gap-2 rounded-full border border-nexlink-primary/20 bg-nexlink-primary/5 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                            <span className="text-sm font-semibold text-nexlink-primary dark:text-white">
                                {selectedCount} selected
                            </span>

                            {bulkActionGroups.map((group) => (
                                <DropdownMenu key={group.id}>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                                            {group.label}
                                            <ChevronDown className="ml-1 size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-40 rounded-xl">
                                        {group.options.map((option) => (
                                            <DropdownMenuItem
                                                key={option.value}
                                                onClick={() => group.onSelect(option.value, selectedIds)}
                                            >
                                                {option.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}

                            {bulkActions.map((action) => (
                                <Button
                                    key={action.id}
                                    type="button"
                                    size="sm"
                                    variant={action.variant === 'destructive' ? 'default' : 'outline'}
                                    onClick={() => action.onClick(selectedIds)}
                                    className={cn(
                                        'rounded-full',
                                        action.variant === 'destructive' && 'bg-red-600 px-4 text-white hover:bg-red-700',
                                    )}
                                >
                                    {action.icon}
                                    {action.label}
                                </Button>
                            ))}

                            {onClearSelection && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClearSelection}
                                    className="size-8 rounded-full"
                                    aria-label="Clear selection"
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    )}

                    {filters.map((filter) => (
                        <select
                            key={filter.id}
                            value={filter.value}
                            onChange={(event) => filter.onChange(event.target.value)}
                            className={cn(
                                'rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200',
                                filter.className,
                            )}
                        >
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ))}

                    <div className="flex items-center gap-3">
                        {showExport && exportOptions.length > 0 && (
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="rounded-full"
                                    onClick={() => {
                                        setShowExportMenu(!showExportMenu);
                                        setShowImportMenu(false);
                                    }}
                                >
                                    <FileDown className="size-4" />
                                    Export
                                    <ChevronDown className="ml-1 size-4" />
                                </Button>

                                {showExportMenu && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white shadow-xl dark:bg-slate-900">
                                        {exportOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                                                onClick={() => {
                                                    option.onClick();
                                                    setShowExportMenu(false);
                                                }}
                                            >
                                                {option.icon}
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {showImport && allImportOptions.length > 0 && (
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="rounded-full"
                                    onClick={() => {
                                        setShowImportMenu(!showImportMenu);
                                        setShowExportMenu(false);
                                    }}
                                >
                                    <Upload className="size-4" />
                                    Import
                                    <ChevronDown className="ml-1 size-4" />
                                </Button>

                                {showImportMenu && (
                                    <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border bg-white shadow-xl dark:bg-slate-900">
                                        {allImportOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                                                onClick={() => {
                                                    option.onClick();
                                                    setShowImportMenu(false);
                                                }}
                                            >
                                                {option.icon}
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {onImportFile && (
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={importAccept}
                                className="hidden"
                                onChange={handleImportChange}
                            />
                        )}

                        {trailing}
                    </div>
                </div>
            </div>
        </div>
    );
}
