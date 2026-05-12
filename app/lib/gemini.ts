"use server";

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInterviewQuestions(jobTitle: string): Promise<string[]> {
  if (!jobTitle.trim()) {
    throw new Error("Job title is required");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Job Title: ${jobTitle}`,
      config: {
        systemInstruction: "You are an expert interviewer. Generate exactly 3 professional, realistic, and role-specific interview questions tailored to the provided job title. Avoid generic questions. Return the response as a JSON array of strings only. Do not include explanations, numbering, or markdown.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const questions = JSON.parse(text);
    if (!Array.isArray(questions) || questions.length !== 3) {
       if (Array.isArray(questions)) {
        return questions.slice(0, 3);
      }
      throw new Error("Invalid format received from AI");
    }

    return questions;
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}
