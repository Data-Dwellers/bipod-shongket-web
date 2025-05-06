"use client";
import Banner from "@/components/Banner";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { summarizeReports } from "@/services/geminiService";
import { getReports } from "@/services/reportService";
import { useEffect, useState } from "react";

export default function Home() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsAndSummarize = async () => {
      try {
        const result = await getReports();
        if (result && result.data) {
          const sortedReports = [...result.data]
            .sort(
              (a, b) => new Date(b.reportingDate) - new Date(a.reportingDate)
            )
            .slice(0, 10);
          setReports(sortedReports);

          // Get AI summary
          const aiSummary = await summarizeReports(sortedReports);
          setSummary(aiSummary);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsAndSummarize();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center p-20">
      <Loading></Loading>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Banner />
      <Separator></Separator>
      {/* AI Summary Section */}
      <Card className="relative border-none">
        <div className="absolute top-0 left-0 text-2xl">
          ✨
        </div>
        <CardContent>
          <div className="flex flex-col justify-center items-center">
            <div className="text-2xl text-red-100 text-center">{summary}</div>
          </div>
        </CardContent>
      </Card>
      <Separator></Separator>
      {/* Individual Reports Section */}
      <div className="grid gap-4 mt-8">
        {reports.map((report) => (
          <div key={report._id} className="p-4 border rounded-lg">
            <h3 className="text-xl text-red-300 font-semibold">
              {report.incedentType}
            </h3>
            <p className="mt-2">{report.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(report.reportingDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
