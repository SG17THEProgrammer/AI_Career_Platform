import Groq from "groq-sdk";
import {
  AIProvider,
  ChatMessage,
  CompletionOptions,
} from "../ai.types.js";
import { env } from "../../../config/env.js";

export class GroqProvider implements AIProvider {
  private client = new Groq({
    apiKey: env.GROQ_API_KEY,
  });

  async chat(
    messages: ChatMessage[],
    options?: CompletionOptions
  ): Promise<string> {
    const response =
      await this.client.chat.completions.create({
        model: env.GROQ_MODEL!,
        messages,
        temperature:
          options?.temperature ?? 0.1,
        max_tokens:
          options?.maxTokens ?? 4000,
        response_format:
          options?.responseFormat === "json"
            ? { type: "json_object" }
            : undefined,
      });

    return (
        response.choices[0]?.message?.content ??
        ""
    );
  }
}