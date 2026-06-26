// apps/api/src/infrastructure/search/jina.provider.ts

import axios from "axios";

import {
  SearchProvider,
  SearchResponse,
} from "./search.types.js";

export class JinaProvider
  implements SearchProvider {
  constructor(
    private apiKey: string
  ) { }

  async search(
    query: string , 
    // numResults = 3
  ): Promise<SearchResponse> {
    const url =  `https://s.jina.ai/?q=${encodeURIComponent(
    query
  )}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
        timeout: 30000,
      });

      console.log("\n========== RAW JINA RESPONSE ==========");
      console.dir(response.data, {
        depth: null,
        colors: true,
      });
      console.log("=======================================\n");

      // process response

      const jinaItems = response.data?.data || [];

        const formattedResults = jinaItems
        // .slice(0, numResults)
        .map((item: any) => ({
          title: item.title || query,
          url: item.url || url,
          snippet: item.description || item.content || "",
          source: "jina",
        }));


      return {
        query,
        provider: "jina",
        results: formattedResults,
      }

    } catch (error) {
      console.error("[JINA SEARCH ERROR]", error);

      return {
        query,
        provider: "jina",
        results: [],
      };
    }

  }
}