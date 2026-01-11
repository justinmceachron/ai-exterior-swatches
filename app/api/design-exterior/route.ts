import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const service = formData.get("service") as string;
    const materialPrompt = formData.get("material") as string; // This receives the LONG description now

    if (!file) return NextResponse.json({ error: "No image found" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    
    // THE FIX: We add 'as any' to the end of the generationConfig object
    // This tells TypeScript: "Trust me, I know what I'm doing."
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-pro-image-preview", 
      generationConfig: { responseModalities: ["IMAGE"] } as any 
    });

    const prompt = `
      Renovate this house. 
      Task: Replace the existing ${service} with brand new: ${materialPrompt}.
      Requirement: Ensure the new ${service} looks photorealistic, follows the correct perspective, and matches the lighting.
      Constraint: Keep the exact same camera angle, yard, and structure. Only change the ${service}.
    `;

    console.log(`Executing Design Request: ${service} -> ${materialPrompt.substring(0, 50)}...`);

    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType: file.type } },
      prompt
    ]);

    const response = await result.response;
    const parts = response.candidates?.[0]?.content?.parts;
    const imageOutput = parts?.find((part) => part.inlineData);

    if (imageOutput?.inlineData) {
      return NextResponse.json({ 
        success: true, 
        url: `data:${imageOutput.inlineData.mimeType || "image/png"};base64,${imageOutput.inlineData.data}` 
      });
    }

    throw new Error("Gemini refused to generate an image.");

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}