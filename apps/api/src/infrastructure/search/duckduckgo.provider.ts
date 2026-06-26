// apps/api/src/infrastructure/search/duckduckgo.provider.ts

import {
  SearchProvider,
  SearchResponse,
} from "./search.types.js";

import { search } from "duck-duck-scrape";

/**
 * First provider we hit.
 *
 * Why?
 * - Free
 * - No API key
 * - Decent quality
 */
export class DuckDuckGoProvider
  implements SearchProvider
{
  async search(
    query: string
  ): Promise<SearchResponse> {
    try{

      console.log("Searching:", query);

    const response = await search(query);

    console.log("response : " , response);

    const results =
      response.results?.map((item) => ({
        title: item.title,
        url: item.url,
        snippet: item.description,
        source: "duckduckgo",
      })) ?? [];

    return {
      query,
      provider : "duckduckgo" , 
      results,
    };
  }
  catch (error) {
      console.error("[DDG SEARCH ERROR]", error);

      return {
        query,
        provider: "duckduckgo",
        results: [],
      };
    }
  }
}