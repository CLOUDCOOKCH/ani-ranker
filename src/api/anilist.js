import { ANIME } from '../data/anime.js';
import { createPortraitPlaceholder } from '../utils/placeholders.js';

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';
const CHARACTER_IMAGE_QUERY = `
  query ($search: String) {
    Character(search: $search) {
      image {
        large
        medium
      }
    }
  }
`;

const imageCache = new Map();

const ALL_GENRES = Array.from(
  new Set(
    ANIME.flatMap((item) => (Array.isArray(item.genres) ? item.genres : []))
  )
).sort((a, b) => a.localeCompare(b));

const ALL_STATUSES = Array.from(new Set(ANIME.map((item) => item.status).filter(Boolean))).sort(
  (a, b) => a.localeCompare(b)
);

const cloneAnime = (anime) => JSON.parse(JSON.stringify(anime));

const normalize = (value) => (typeof value === 'string' ? value.toLowerCase() : '');

const matchesQuery = (anime, query) => {
  if (!query) {
    return true;
  }
  const title = anime.title || {};
  const romaji = normalize(title.romaji);
  const english = normalize(title.english);
  return romaji.includes(query) || english.includes(query);
};

const matchesGenres = (anime, genres) => {
  if (!genres || genres.length === 0) {
    return true;
  }
  const list = Array.isArray(anime.genres) ? anime.genres : [];
  return genres.every((genre) => list.includes(genre));
};

const matchesStatuses = (anime, statuses) => {
  if (!statuses || statuses.length === 0) {
    return true;
  }
  if (!anime.status) {
    return false;
  }
  return statuses.includes(anime.status);
};

export async function searchAnime(query, options = {}) {
  const normalizedQuery = normalize(query ? query.trim() : '');
  const requestedGenres = Array.isArray(options.genres) ? options.genres : [];
  const requestedStatuses = Array.isArray(options.statuses) ? options.statuses : [];
  const page = options.page && options.page > 0 ? options.page : 1;
  const perPage = options.perPage && options.perPage > 0 ? options.perPage : 20;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const filtered = ANIME.filter(
    (item) =>
      matchesQuery(item, normalizedQuery) &&
      matchesGenres(item, requestedGenres) &&
      matchesStatuses(item, requestedStatuses)
  );

  return filtered.slice(start, end).map(cloneAnime);
}

export async function getAnimeById(id) {
  const numericId = typeof id === 'string' ? Number(id) : id;
  const anime = ANIME.find((item) => item.id === numericId);
  return anime ? cloneAnime(anime) : null;
}

export async function fetchGenres() {
  return ALL_GENRES.slice();
}

export async function fetchStatuses() {
  return ALL_STATUSES.slice();
}

export async function fetchCharacterImage(name) {
  if (!name) {
    return null;
  }

  const cached = imageCache.get(name);
  if (cached) {
    return cached;
  }

  if (typeof fetch !== 'function') {
    const placeholder = createPortraitPlaceholder(name);
    imageCache.set(name, placeholder);
    return placeholder;
  }

  const request = (async () => {
    const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: CHARACTER_IMAGE_QUERY,
        variables: { search: name },
      }),
    });

    if (!response.ok) {
      throw new Error('Character lookup failed');
    }

    const payload = await response.json();
    if (payload.errors && payload.errors.length > 0) {
      throw new Error(payload.errors[0]?.message || 'Character lookup failed');
    }

    const image =
      payload?.data?.Character?.image?.large ||
      payload?.data?.Character?.image?.medium ||
      null;

    if (!image) {
      throw new Error('Portrait unavailable');
    }

    imageCache.set(name, image);
    return image;
  })().catch((error) => {
    imageCache.delete(name);
    throw error instanceof Error ? error : new Error('Unable to fetch portrait');
  });

  imageCache.set(name, request);
  return request;
}

export function clearCharacterImageCache() {
  imageCache.clear();
}
