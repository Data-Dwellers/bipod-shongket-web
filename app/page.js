"use client";
import Banner from "@/components/Banner";
import { getReports } from "@/services/reportService";
import { summarizeReports } from "@/services/geminiService";
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
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Banner />

      {/* AI Summary Section */}
      <div className="my-8 p-6 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Incident Analysis</h2>
        <div className="whitespace-pre-line">{summary}</div>
      </div>

      {/* Individual Reports Section */}
      <div className="grid gap-4 mt-8">
        {reports.map((report) => (
          <div key={report._id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">
              Incident Type: {report.incedentType}
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
