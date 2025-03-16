import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            
        const data = await req.json();
        const prompt = data.body;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const output = await response.text();

        return NextResponse.json({ output });
    } catch (error) {
        console.error("Error generating quote:", error);
        return NextResponse.json({ error: "Failed to generate quote" }, { status: 500 });
    }
}
