import { GroqProvider } from "./providers/groq.provider.js";
import {
  ChatMessage,
  CompletionOptions,
} from "./ai.types.js";

class AIService {
  private provider =
    new GroqProvider();

  async chat(
    messages: ChatMessage[],
    options?: CompletionOptions
  ) {
    return this.provider.chat(
      messages,
      options
    );
  }

  async json<T>(
    messages: ChatMessage[]
  ): Promise<T> {
    const response =
      await this.provider.chat(
        messages,
        {
          responseFormat: "json",
          temperature: 0,
        }
      );

    try {
      return JSON.parse(response) as T;
    } catch {
      throw new Error("Invalid JSON from AI");
    };
  }
}

export const aiService =
  new AIService();