export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

/**
 * Standard search response used everywhere.
 */
export interface SearchResponse {
  query: string;
  provider: string;
  results: SearchResult[];
}


export interface SearchProvider {
  search(query: string
    // , numResults?: number
  ): Promise<SearchResponse>;
}