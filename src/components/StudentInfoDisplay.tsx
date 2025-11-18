import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface StudentInfoDisplayProps {
  studentId: string;
  studentName: string;
}

export const StudentInfoDisplay = ({ studentId, studentName }: StudentInfoDisplayProps) => {
  return (
    <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Student Record</p>
            <p className="font-semibold text-lg">
              {studentName} • ID: {studentId}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
