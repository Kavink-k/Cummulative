import { useState } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { bulkUploadUsers, downloadTemplate, BulkUploadResult } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";

export default function BulkUploadComponent() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const { toast } = useToast();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            validateAndSetFile(droppedFile);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        const validTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
        const isValidExtension = ['csv', 'xls', 'xlsx'].includes(fileExtension || '');

        if (!validTypes.includes(selectedFile.type) && !isValidExtension) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a CSV or Excel file (.csv, .xls, .xlsx)",
                variant: "destructive",
            });
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            toast({
                title: "File Too Large",
                description: "File size should not exceed 5MB",
                variant: "destructive",
            });
            return;
        }

        setFile(selectedFile);
        setUploadResult(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const result = await bulkUploadUsers(file);
            setUploadResult(result);

            if (result.errorCount === 0) {
                toast({
                    title: "Upload Successful",
                    description: `Successfully uploaded ${result.successCount} users`,
                });
            } else {
                toast({
                    title: "Upload Completed with Errors",
                    description: `${result.successCount} succeeded, ${result.errorCount} failed`,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Upload Failed",
                description: error.response?.data?.message || "Failed to upload users",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = async (format: 'csv' | 'xlsx') => {
        try {
            await downloadTemplate(format);
            toast({
                title: "Template Downloaded",
                description: `Template downloaded as ${format.toUpperCase()}`,
            });
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Failed to download template",
                variant: "destructive",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bulk User Upload</CardTitle>
                <CardDescription>
                    Upload multiple users at once using CSV or Excel files
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Template Download Section */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTemplate('csv')}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV Template
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTemplate('xlsx')}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Excel Template
                    </Button>
                </div>

                {/* File Upload Section */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".csv,.xls,.xlsx"
                        onChange={handleFileChange}
                    />

                    {!file ? (
                        <div className="space-y-4">
                            <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Drag and drop your file here, or
                                </p>
                                <label htmlFor="file-upload">
                                    <Button variant="link" className="cursor-pointer" asChild>
                                        <span>browse files</span>
                                    </Button>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Supported formats: CSV, XLS, XLSX (Max 5MB)
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload Users'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFile(null);
                                        setUploadResult(null);
                                    }}
                                    disabled={uploading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload Progress */}
                {uploading && (
                    <div className="space-y-2">
                        <Progress value={undefined} className="w-full" />
                        <p className="text-sm text-center text-gray-600">Processing users...</p>
                    </div>
                )}

                {/* Upload Results */}
                {uploadResult && (
                    <div className="space-y-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="font-medium mb-2">Upload Summary</div>
                                <div className="space-y-1 text-sm">
                                    <p>Total Rows: {uploadResult.totalRows}</p>
                                    <p className="text-green-600">✓ Successful: {uploadResult.successCount}</p>
                                    <p className="text-red-600">✗ Failed: {uploadResult.errorCount}</p>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Success Details */}
                        {uploadResult.success.length > 0 && (
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium text-sm mb-2 flex items-center text-green-600">
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Successfully Created Users
                                </h4>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {uploadResult.success.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-600">
                                            Row {item.row}: {item.name} ({item.email})
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error Details */}
                        {uploadResult.errors.length > 0 && (
                            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <h4 className="font-medium text-sm mb-2 flex items-center text-red-600">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Errors
                                </h4>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {uploadResult.errors.map((item, idx) => (
                                        <div key={idx} className="text-sm text-red-700">
                                            Row {item.row}: {item.email} - {item.error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
