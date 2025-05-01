"use client"

import { getReports, updateReport } from "@/services/reportService";
import Loading from "@/components/Loading";
import { AuthContext } from "@/providers/AuthProvider";
import { useContext, useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";

export default function Community() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const result = await getReports();
                if (result && result.data) {
                    // Sort reports by reportingDate in descending order (newest first)
                    const sortedReports = [...result.data].sort((a, b) =>
                        new Date(b.reportingDate) - new Date(a.reportingDate)
                    );
                    setReports(sortedReports);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleAddComment = async (reportId) => {
        if (!commentText.trim() || !user) return;

        try {
            const report = reports.find(r => r._id === reportId);
            if (!report) return;

            const updatedComments = [...(report.comments || []), {
                text: commentText,
                authorName: user.name || 'Anonymous',
                authorEmail: user.email,
                createdAt: new Date()
            }];

            const result = await updateReport({ _id: reportId }, { comments: updatedComments });

            if (result) {
                const updatedReports = reports.map(report => {
                    if (report._id === reportId) {
                        return { ...report, comments: updatedComments };
                    }
                    return report;
                });

                setReports([...updatedReports]);
                setCommentText("");

                // If commenting on the selected report, update that too
                if (selectedReport && selectedReport._id === reportId) {
                    setSelectedReport({ ...selectedReport, comments: updatedComments });
                }
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const openReportDetails = (report) => {
        setSelectedReport(report);
    };

    if (loading) {
        return <div className="flex justify-center items-center p-20">
            <Loading></Loading>
        </div>;
    }

    return (
        <div className="flex flex-col w-full justify-center items-center gap-6 p-6">
            <Card className="w-full max-w-7xl">
                <CardContent className="flex justify-around items-center">
                    <h1 className="font-bold text-xl"><span className="text-red-600">Bipod</span> Shongket <span className="text-green-600">Community</span></h1>
                    <Link href="/community-post">
                        <Button>Make A New Report</Button>
                    </Link>
                </CardContent>
            </Card>
            <AlertDialog>
                {reports.map((report) => (
                    <Card key={report._id} className="max-w-7xl w-full">
                        <CardHeader>
                            <CardTitle className="text-red-600">{report.incedentType}</CardTitle>
                            <CardDescription>

                                Reported by : {report && report.ownerName} ({report && report.owner})
                                <br></br>
                                Reported on: {new Date(report.reportingDate).toLocaleDateString()}

                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow wrap-break-word">
                            <p className="mb-4">{report.description}</p>
                            <div className="text-sm text-muted-foreground">
                                <p>Location:</p>
                                <ul className="list-disc list-inside pl-4">
                                    <li>Country: {report.location.country}</li>
                                    <li>City: {report.location.city}</li>
                                    <li>Street: {report.location.street}</li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start w-full gap-3">
                            <div className="flex w-full justify-between items-center">
                                <p className="text-sm text-muted-foreground">Incident Date: {new Date(report.incedentDate).toLocaleDateString()}</p>
                                <AlertDialogTrigger asChild onClick={() => openReportDetails(report)}>
                                    <Button variant="outline" size="sm">
                                        Comments ({report.comments?.length || 0})
                                    </Button>
                                </AlertDialogTrigger>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
                {/* Report Details Modal */}
                <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onCloseAutoFocus={e => e.preventDefault()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">{selectedReport?.incedentType}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Reported by : {selectedReport && selectedReport.ownerName} ({selectedReport && selectedReport.owner})
                            <br></br>
                            Reported on: {selectedReport && new Date(selectedReport.reportingDate).toLocaleDateString()}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4">
                        <p className="mb-4">{selectedReport?.description}</p>
                        <div className="text-sm text-muted-foreground">
                            <p>Location:</p>
                            <ul className="list-disc list-inside pl-4">
                                <li>Country: {selectedReport?.location?.country}</li>
                                <li>City: {selectedReport?.location?.city}</li>
                                <li>Street: {selectedReport?.location?.street}</li>
                            </ul>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Incident Date: {selectedReport && new Date(selectedReport.incedentDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-medium mb-3">Comments ({selectedReport?.comments?.length || 0})</h3>

                        <div className="space-y-3 max-h-[30vh] overflow-y-auto">
                            {selectedReport?.comments?.map((comment, index) => (
                                <div key={index} className="border rounded-md p-3 bg-muted/30">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-medium">{comment.authorName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <p>{comment.text}</p>
                                </div>
                            ))}

                            {(!selectedReport?.comments || selectedReport.comments.length === 0) && (
                                <p className="text-muted-foreground text-center py-2">No comments yet</p>
                            )}
                        </div>
                        <Input
                            className="mt-5"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && selectedReport && handleAddComment(selectedReport._id)}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => selectedReport && handleAddComment(selectedReport._id)}>
                            Post
                        </AlertDialogAction>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </div>
    );
}
