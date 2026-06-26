// apps/api/src/infrastructure/search/search.service.ts

import { env } from "../../config/env.js";
import {
  SearchProvider,
  SearchResponse,
} from "./search.types.js";

import { JinaProvider } from "./jina.provider.js";
import { TavilyProvider } from "./tavily.provider.js";
import { SerperProvider } from "./serper.provider.js";

export class SearchService {
  private providers: SearchProvider[] = [];

  constructor() {
    if (env.JINA_API_KEY) {
      this.providers.push(
        new JinaProvider(env.JINA_API_KEY)
      );
    }

    if (env.TAVILY_API_KEY) {
      this.providers.push(
        new TavilyProvider(env.TAVILY_API_KEY)
      );
    }

    if (env.SERPER_API_KEY) {
      this.providers.push(
        new SerperProvider(env.SERPER_API_KEY)
      );
    }
  }

  /**
   * Runs the query against available providers sequentially.
   * Returns the first successful response.
   */
  async search(query: string): Promise<SearchResponse> {
    let lastError: unknown;
    
    for (const provider of this.providers) {
      try {
        console.log(`[SEARCH] Trying ${provider.constructor.name}`);

        // Removed minResults constraint completely to maximize efficiency per 10k token drop
        const response = await provider.search(query);

        console.log(
          `[SEARCH] ${provider.constructor.name} returned ${response.results.length} results`
        );

        return response;
  
      } catch (error) {
        console.error(
          `[SEARCH] ${provider.constructor.name} failed`,
          error
        );
        lastError = error;
      }
    }

    // If an error stopped all providers, surface it directly
    if (lastError) {
      throw lastError;
    }

    // Absolute safe fallback if providers are empty or returned cleanly but empty
    return {
      query,
      provider: "none",
      results: [],
    };
  }

  async searchMany(queries: string[]): Promise<SearchResponse[]> {
    return Promise.all(
      queries.map((query) => this.search(query))
    );
  }
}
