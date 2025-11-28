import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add this import for URL input
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadBulkFile } from "../lib/api"; // Import the new API function

export default function BulkSubmission() {
  const [file, setFile] = useState<File | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(""); // New state for URL
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleUpload = async () => {
    if (!file && !googleSheetUrl) {
      toast.error("Please select a CSV/XLSX file or provide a Google Sheet URL.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadBulkFile({ file, googleSheetUrl });
      toast.success(response.data.message || "Bulk upload successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Bulk upload failed. Please try again.");
      console.error("Bulk upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bulk Submission</h1>
              <p className="text-sm text-muted-foreground">
                Upload many student records at once (CSV, Excel, or Google Sheet URL).
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle>Upload File or Google Sheet</CardTitle>
            <CardDescription>
              Accepted formats: <strong>.csv</strong>, <strong>.xlsx</strong>, <strong>.xls</strong> or public Google Sheet URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full md:w-auto"
              />
              <Input
                type="url"
                placeholder="Or paste Google Sheet URL (public share link)"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                className="w-full md:w-96"
              />
              <Button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>First row should contain column headers.</li>
              <li>Include required fields (e.g., Name, RegNo, DOB, Program, etc.).</li>
              <li>We’ll validate and show a preview before final submission (coming next).</li>
              <li>For Google Sheets: Share as "Anyone with link can view" and paste the full URL.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}