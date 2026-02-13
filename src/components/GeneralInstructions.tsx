import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Info } from "lucide-react";

interface GeneralInstructionsProps {
    onNext?: () => void;
    mode?: 'edit' | 'view' | 'print';
}

export const GeneralInstructions = ({ onNext, mode = 'edit' }: GeneralInstructionsProps) => {
    const showButton = mode === 'edit' && onNext;
    return (
        <div className="space-y-6">
            {/* Header Alert */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-blue-900">General Instructions</h3>
                        <p className="text-sm text-blue-800 mt-1">
                            Please read these instructions carefully before filling out the forms
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Instructions Card */}
            <Card className="p-6">
                <div className="space-y-6">
                    {/* Introduction */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Important Guidelines</h2>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>The Cumulative register has to be written neatly and clearly using black or blue pen without any error.</p>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>Overwriting and usage of whitener has to be avoided.</p>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>Mark tick (✓) at one place wherever multiple options are available.</p>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>Follow the format DDMMYY to write the date.</p>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>The cumulative should be kept neat, instead write NIL in the column.</p>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>Marks obtained in the semester at theoretical, State level, participation and achievements has to be documented.</p>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>Credit points should be calculated based on the following guidelines:</p>
                            </div>
                        </div>
                    </div>

                    {/* Grading Tables */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Theory, Skill Lab, Practicum Table */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Credit Hours</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Credit Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-3 py-2">1 Credit =40 Hours</td>
                                            <td className="border border-gray-300 px-3 py-2">1 Credit =40 hours</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Grading Performance Table */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Grading Performance (UGC 10 point grading system)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Letter Grade</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Grade Point</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">% of Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="border border-gray-300 px-3 py-2">O (Outstanding)</td><td className="border border-gray-300 px-3 py-2">10</td><td className="border border-gray-300 px-3 py-2">&gt;85</td></tr>
                                        <tr><td className="border border-gray-300 px-3 py-2">A+ (Excellent)</td><td className="border border-gray-300 px-3 py-2">9</td><td className="border border-gray-300 px-3 py-2">80-84.99</td></tr>
                                        <tr><td className="border border-gray-300 px-3 py-2">A (Very Good)</td><td className="border border-gray-300 px-3 py-2">8</td><td className="border border-gray-300 px-3 py-2">75-79.99</td></tr>
                                        <tr><td className="border border-gray-300 px-3 py-2">B+ (Good)</td><td className="border border-gray-300 px-3 py-2">7</td><td className="border border-gray-300 px-3 py-2">65-74.99</td></tr>
                                        <tr><td className="border border-gray-300 px-3 py-2">B (Above Average)</td><td className="border border-gray-300 px-3 py-2">6</td><td className="border border-gray-300 px-3 py-2">60-64.99</td></tr>
                                        <tr><td className="border border-gray-300 px-3 py-2">C (Average/P+pass)</td><td className="border border-gray-300 px-3 py-2">5</td><td className="border border-gray-300 px-3 py-2">50-59.99</td></tr>
                                        <tr><td className="border border-gray-300 px-3 py-2">F (Fail)</td><td className="border border-gray-300 px-3 py-2">0</td><td className="border border-gray-300 px-3 py-2">&lt;50</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* SGPA Calculation */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">Calculation of SGPA & CGPA</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>SGPA (Semester Grade Point Average):</strong> Calculated by summing total credit hours multiplied by the grade point obtained in each semester divided by total credit hours in the entire program.</p>
                            <p className="font-mono bg-white p-2 rounded border border-gray-200">
                                SGPA = Σ(Cr × Gr) / ΣCr
                            </p>
                            <p className="text-xs text-gray-600">Where Cr = Credit hours, Gr = Grade point</p>

                            <p className="mt-4"><strong>CGPA:</strong> Cumulative Grade Point Average</p>
                            <p className="font-mono bg-white p-2 rounded border border-gray-200">
                                CGPA = (Σ of all SGPA) / Total number of semesters
                            </p>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
                        <h3 className="font-semibold text-amber-900 mb-2">Important Notes</h3>
                        <ul className="space-y-1 text-sm text-amber-800">
                            <li>• Communicative English and Elective modules are not included for calculating SGPA.</li>
                            <li>• 70/10 = 7 (rounded off to two decimal points)</li>
                            <li>• Declaration of pass: This shall be awarded only if the candidate completes the program within the stipulated period. All other successful candidates would be declared as pass.</li>
                            <li>• First class: CGPA of 6.00-7.49</li>
                            <li>• Second class: CGPA of 5.00-5.99</li>
                            <li>• First class with distinction: CGPA of 7.5 and above</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Continue Button - Only show in edit mode */}
            {showButton && (
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="gap-2"
                    >
                        I Understand, Continue
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
