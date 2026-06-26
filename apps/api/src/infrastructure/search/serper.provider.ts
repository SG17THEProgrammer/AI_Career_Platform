// apps/api/src/infrastructure/search/serper.provider.ts

import axios from "axios";
import {
  SearchProvider,
  SearchResponse,
} from "./search.types.js";

export class SerperProvider implements SearchProvider {
  private apiKey: string;
  private baseUrl = "https://google.serper.dev/search";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<SearchResponse> {
    const response = await axios.post(
      this.baseUrl,
      {
        q: query,
      },
      {
        headers: {
          "X-API-KEY": this.apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const results =
      response.data.organic?.map((item: any) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        source: "serper",
      })) ?? [];

    return {
      query,
      provider : "serper" , 
      results,
    };
  }
}