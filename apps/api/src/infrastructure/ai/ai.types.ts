export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
}

export interface AIProvider {
  chat(
    messages: ChatMessage[],
    options?: CompletionOptions
  ): Promise<string>;
}