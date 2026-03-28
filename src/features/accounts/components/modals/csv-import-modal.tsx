'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useImportCsv } from '../../api/use-import-csv';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

interface CsvImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CsvImportModal({ isOpen, onClose }: CsvImportModalProps) {
    const importMutation = useImportCsv();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = () => {
        if (!file) return;

        importMutation.mutate(file, {
            onSuccess: () => {
                setFile(null);
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Accounts via CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file containing landlord details. Ensure headers match the template format.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 my-4">
                    {file ? (
                        <div className="flex flex-col items-center space-y-2">
                            <FileText className="h-10 w-10 text-[#3b82f6]" />
                            <span className="text-sm font-medium text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-500 mt-2 hover:text-red-700">
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-3">
                            <UploadCloud className="h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500 text-center">Drag and drop your CSV file here, or click to browse</p>
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                id="csv-upload"
                                onChange={handleFileChange}
                            />
                            <Button variant="outline" asChild size="sm">
                                <label htmlFor="csv-upload" className="cursor-pointer">
                                    Browse Files
                                </label>
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} disabled={importMutation.isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleImport} 
                        disabled={!file || importMutation.isPending}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex gap-2"
                    >
                        {importMutation.isPending ? 'Importing...' : 'Import Data'}
                        {importMutation.isSuccess && <CheckCircle2 className="h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
