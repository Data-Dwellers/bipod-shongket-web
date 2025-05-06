import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const summarizeReports = async (reports) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze and summarize the following incident reports:
      ${reports
        .map(
          (report) => `
        Type: ${report.incedentType}
        Description: ${report.description}
        Date: ${new Date(report.reportingDate).toLocaleDateString()}
        Location: ${report.location.city}, ${report.location.country}
      `
        )
        .join("\n")}
      
      Please provide:
      1. Total number of incidents by type
      2. Most affected areas
      3. Key patterns or trends
      4. Brief summary of notable incidents`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Unable to generate summary at this time.";
  }
};
