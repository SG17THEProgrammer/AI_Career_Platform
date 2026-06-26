import axios from "axios";
import {
  SearchProvider,
  SearchResponse,
} from "./search.types.js";

export class TavilyProvider implements SearchProvider {
  private apiKey: string;
  private baseUrl = "https://api.tavily.com/search";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<SearchResponse> {
    const response = await axios.post(
      this.baseUrl,
      {
        api_key: this.apiKey,
        query,
        search_depth: "advanced",
        include_answer: false,
        include_raw_content: false,
        max_results: 8,
      }
    );

    const results =
      response.data.results?.map((item: any) => ({
        title: item.title,
        url: item.url,
        snippet: item.content,
        source: "tavily",
      })) ?? [];

    return {
      query,
      provider : "tavily" ,  
      results,
    };
  }
}