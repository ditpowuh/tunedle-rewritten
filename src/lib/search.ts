import Fuse from "fuse.js";
import {isMobile} from "react-device-detect";

import type {SearchResult} from "@/types/search";

export function normalize(input: string): string {
  return input.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC");
}

function expandRanges(ranges: ReadonlyArray<readonly [number, number]>): number[] {
  const positions: number[] = [];
  for (const range of ranges) {
    for (let index = range[0]; index <= range[1]; index++) {
      positions.push(index);
    }
  }
  return positions;
}

export function searchAnswers(query: string, options: string[]): SearchResult[] {
  if (query.length < 1) {
    return [];
  }
  const fuse = new Fuse(options, {
    includeMatches: true,
    ignoreDiacritics: true,
    threshold: 0.4,
    ignoreLocation: true
  });
  return fuse.search(query, {limit: isMobile ? 9 : 15}).map((result) => ({
    value: result.item,
    positions: expandRanges(result.matches?.[0]?.indices ?? [])
  }));
}
