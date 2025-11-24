import { GoogleGenAI } from "@google/genai";
import { Experiment, StatsAnalysis } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeExperiment = async (
  experiment: Experiment,
  stats: StatsAnalysis[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Construct a prompt that describes the data
    const prompt = `
      You are a senior data scientist specializing in conversion rate optimization (CRO) for eCommerce.
      Analyze the following A/B test results for a WordPress/WooCommerce site.

      Experiment Name: ${experiment.name}
      Type: ${experiment.type}
      Context URL: ${experiment.url}

      Data:
      ${experiment.variants.map(v => {
        const stat = stats.find(s => s.variantId === v.id);
        return `- Variant "${v.name}" (${v.isControl ? 'Control' : 'Variation'}): ${v.visitors} visitors, ${v.conversions} conversions. CR: ${stat?.conversionRate.toFixed(2)}%. Chance to Beat Control: ${stat?.significance.toFixed(1)}%.`;
      }).join('\n')}

      Please provide:
      1. A brief executive summary of the performance.
      2. A statistical interpretation (is the result significant?).
      3. A recommendation (Deploy winner, keep testing, or stop).
      4. A hypothesis on why the winner performed better given the context of a typical eCommerce store if applicable.

      Keep the tone professional, concise, and action-oriented.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Error generating AI analysis. Please check your API key configuration.";
  }
};