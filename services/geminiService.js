import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const summarizeReports = async (reports) => {
  try {

    const prompt = `Generate a concise incident report summary suitable for a website's front page, based on the provided data for some reports in Bangladesh.
The summary must be:
- Easy to read and provide a quick overview of the current situation.
- Strictly limited to a maximum of 5 lines.
- Contain no heading or title.

Include the following information:
- Total number of incidents broken down by type.
- The most frequently affected areas (cities/countries).
- Any noticeable patterns or trends.
- A brief mention of significant incidents, if any.

Incident Data:
${reports
        .map(
          (report) => `Type: ${report.incedentType} | Description: ${report.description} | Date: ${new Date(report.reportingDate).toLocaleDateString()} | Location: ${report.location.city}, ${report.location.country}`
        )
        .join("\n")}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Unable to generate summary at this time.";
  }
};
