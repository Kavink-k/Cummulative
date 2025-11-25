import React from 'react';

interface Attempt {
    maxMarks: number | null;
    score: number | null;
    percentage: number | null;
}

interface Subject {
    subject: string;
    plusOneAttempts: Attempt[];
    plusTwoAttempts: Attempt[];
}

interface EducationalMarksTableProps {
    subjects: Subject[];
    totalPlusOneAttempts: Attempt[];
    totalPlusTwoAttempts: Attempt[];
    className?: string;
}

export const EducationalMarksTable: React.FC<EducationalMarksTableProps> = ({
    subjects,
    totalPlusOneAttempts,
    totalPlusTwoAttempts,
    className = '',
}) => {
    if (!subjects || subjects.length === 0) {
        return <p className="text-muted-foreground">No marks data available.</p>;
    }

    const plusOneAttemptCount = totalPlusOneAttempts?.length || 0;
    const plusTwoAttemptCount = totalPlusTwoAttempts?.length || 0;

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse border border-border min-w-[900px]">
                <thead>
                    {/* Main header row */}
                    <tr className="bg-muted text-sm">
                        <th className="border border-border p-2 text-left w-40">Subject</th>
                        {plusOneAttemptCount > 0 && (
                            <th className="border border-border p-2 text-center" colSpan={3 * plusOneAttemptCount}>
                                H.S.C (+1)
                            </th>
                        )}
                        {plusTwoAttemptCount > 0 && (
                            <th className="border border-border p-2 text-center" colSpan={3 * plusTwoAttemptCount}>
                                H.S.C (+2)
                            </th>
                        )}
                    </tr>

                    {/* Attempt headers */}
                    <tr className="bg-muted/70 text-xs">
                        <th className="border border-border p-2"></th>
                        {totalPlusOneAttempts?.map((_, i) => (
                            <th key={`h1-${i}`} className="border border-border p-2" colSpan={3}>
                                Attempt {i + 1}
                            </th>
                        ))}
                        {totalPlusTwoAttempts?.map((_, i) => (
                            <th key={`h2-${i}`} className="border border-border p-2" colSpan={3}>
                                Attempt {i + 1}
                            </th>
                        ))}
                    </tr>

                    {/* Column headers (Max, Score, %) */}
                    <tr className="bg-muted/50 text-xs">
                        <th className="border border-border p-2"></th>
                        {totalPlusOneAttempts?.map((_, i) => (
                            <React.Fragment key={`h1-cols-${i}`}>
                                <th className="border border-border p-1">Max</th>
                                <th className="border border-border p-1">Score</th>
                                <th className="border border-border p-1">%</th>
                            </React.Fragment>
                        ))}
                        {totalPlusTwoAttempts?.map((_, i) => (
                            <React.Fragment key={`h2-cols-${i}`}>
                                <th className="border border-border p-1">Max</th>
                                <th className="border border-border p-1">Score</th>
                                <th className="border border-border p-1">%</th>
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* Subject rows */}
                    {subjects.map((subject, index) => (
                        <tr key={index} className="text-sm">
                            <td className="border border-border p-2 font-medium">{subject.subject}</td>

                            {/* HSC +1 attempts */}
                            {subject.plusOneAttempts?.map((attempt, attemptIdx) => (
                                <React.Fragment key={`s${index}-p1-${attemptIdx}`}>
                                    <td className="border border-border p-1 text-center">
                                        {attempt.maxMarks ?? '-'}
                                    </td>
                                    <td className="border border-border p-1 text-center">
                                        {attempt.score ?? '-'}
                                    </td>
                                    <td className="border border-border p-1 text-center">
                                        {attempt.percentage ? `${attempt.percentage}%` : '-'}
                                    </td>
                                </React.Fragment>
                            ))}

                            {/* HSC +2 attempts */}
                            {subject.plusTwoAttempts?.map((attempt, attemptIdx) => (
                                <React.Fragment key={`s${index}-p2-${attemptIdx}`}>
                                    <td className="border border-border p-1 text-center">
                                        {attempt.maxMarks ?? '-'}
                                    </td>
                                    <td className="border border-border p-1 text-center">
                                        {attempt.score ?? '-'}
                                    </td>
                                    <td className="border border-border p-1 text-center">
                                        {attempt.percentage ? `${attempt.percentage}%` : '-'}
                                    </td>
                                </React.Fragment>
                            ))}
                        </tr>
                    ))}

                    {/* Total row */}
                    <tr className="bg-muted/20 font-bold text-sm">
                        <td className="border border-border p-2">TOTAL</td>

                        {/* HSC +1 totals */}
                        {totalPlusOneAttempts?.map((total, idx) => (
                            <React.Fragment key={`t1-${idx}`}>
                                <td className="border border-border p-1 text-center bg-muted">
                                    {total.maxMarks ?? '-'}
                                </td>
                                <td className="border border-border p-1 text-center bg-muted">
                                    {total.score ?? '-'}
                                </td>
                                <td className="border border-border p-1 text-center bg-muted">
                                    {total.percentage ? `${total.percentage}%` : '-'}
                                </td>
                            </React.Fragment>
                        ))}

                        {/* HSC +2 totals */}
                        {totalPlusTwoAttempts?.map((total, idx) => (
                            <React.Fragment key={`t2-${idx}`}>
                                <td className="border border-border p-1 text-center bg-muted">
                                    {total.maxMarks ?? '-'}
                                </td>
                                <td className="border border-border p-1 text-center bg-muted">
                                    {total.score ?? '-'}
                                </td>
                                <td className="border border-border p-1 text-center bg-muted">
                                    {total.percentage ? `${total.percentage}%` : '-'}
                                </td>
                            </React.Fragment>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
