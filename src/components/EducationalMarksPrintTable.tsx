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

interface EducationalMarksPrintTableProps {
    subjects: Subject[];
    totalPlusOneAttempts: Attempt[];
    totalPlusTwoAttempts: Attempt[];
}

export const EducationalMarksPrintTable: React.FC<EducationalMarksPrintTableProps> = ({
    subjects,
    totalPlusOneAttempts,
    totalPlusTwoAttempts,
}) => {
    if (!subjects || subjects.length === 0) {
        return <p className="text-muted-foreground">No marks data available.</p>;
    }

    const plusOneAttemptCount = totalPlusOneAttempts?.length || 0;
    const plusTwoAttemptCount = totalPlusTwoAttempts?.length || 0;

    return (
        <div className="space-y-6">
            {/* HSC +1 Table */}
            {plusOneAttemptCount > 0 && (
                <div>
                    <h5 className="font-semibold mb-2">H.S.C (+1) Marks</h5>
                    <table className="data-table" style={{ width: '100%', fontSize: '11px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Subject</th>
                                {totalPlusOneAttempts?.map((_, i) => (
                                    <React.Fragment key={`h1-${i}`}>
                                        <th>Max</th>
                                        <th>Score</th>
                                        <th>%</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'left' }}>{subject.subject}</td>
                                    {subject.plusOneAttempts?.map((attempt, attemptIdx) => (
                                        <React.Fragment key={`s${index}-p1-${attemptIdx}`}>
                                            <td>{attempt.maxMarks ?? '-'}</td>
                                            <td>{attempt.score ?? '-'}</td>
                                            <td>{attempt.percentage ? `${attempt.percentage}%` : '-'}</td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                            {/* Total row */}
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                <td style={{ textAlign: 'left' }}>TOTAL</td>
                                {totalPlusOneAttempts?.map((total, idx) => (
                                    <React.Fragment key={`t1-${idx}`}>
                                        <td>{total.maxMarks ?? '-'}</td>
                                        <td>{total.score ?? '-'}</td>
                                        <td>{total.percentage ? `${total.percentage}%` : '-'}</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* HSC +2 Table */}
            {plusTwoAttemptCount > 0 && (
                <div>
                    <h5 className="font-semibold mb-2">H.S.C (+2) Marks</h5>
                    <table className="data-table" style={{ width: '100%', fontSize: '11px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Subject</th>
                                {totalPlusTwoAttempts?.map((_, i) => (
                                    <React.Fragment key={`h2-${i}`}>
                                        <th>Max</th>
                                        <th>Score</th>
                                        <th>%</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'left' }}>{subject.subject}</td>
                                    {subject.plusTwoAttempts?.map((attempt, attemptIdx) => (
                                        <React.Fragment key={`s${index}-p2-${attemptIdx}`}>
                                            <td>{attempt.maxMarks ?? '-'}</td>
                                            <td>{attempt.score ?? '-'}</td>
                                            <td>{attempt.percentage ? `${attempt.percentage}%` : '-'}</td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                            {/* Total row */}
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                <td style={{ textAlign: 'left' }}>TOTAL</td>
                                {totalPlusTwoAttempts?.map((total, idx) => (
                                    <React.Fragment key={`t2-${idx}`}>
                                        <td>{total.maxMarks ?? '-'}</td>
                                        <td>{total.score ?? '-'}</td>
                                        <td>{total.percentage ? `${total.percentage}%` : '-'}</td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
