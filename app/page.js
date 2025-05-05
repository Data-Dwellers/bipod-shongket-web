"use client";
import Banner from "@/components/Banner";
import { getReports } from "@/services/reportService";
import { useEffect, useState } from "react";

export default function Home() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await getReports();
        if (result && result.data) {
          // Sort reports by reportingDate in descending order and take first 10
          const sortedReports = [...result.data]
            .sort(
              (a, b) => new Date(b.reportingDate) - new Date(a.reportingDate)
            )
            .slice(0, 10);
          setReports(sortedReports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <Banner></Banner>
      <div>
        {reports.map((report) => (
          <div key={report._id}>
            <h1>Incednet Type : {report.incedentType}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
