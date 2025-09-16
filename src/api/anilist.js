import { ANIME } from '../data/anime.js';

const imageCache = new Map();

const ALL_GENRES = Array.from(
  new Set(
    ANIME.flatMap((item) => (Array.isArray(item.genres) ? item.genres : []))
  )
).sort((a, b) => a.localeCompare(b));

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

export async function searchAnime(query, options = {}) {
  const normalizedQuery = normalize(query ? query.trim() : '');
  const requestedGenres = Array.isArray(options.genres) ? options.genres : [];
  const page = options.page && options.page > 0 ? options.page : 1;
  const perPage = options.perPage && options.perPage > 0 ? options.perPage : 20;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const filtered = ANIME.filter(
    (item) => matchesQuery(item, normalizedQuery) && matchesGenres(item, requestedGenres)
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

export async function fetchCharacterImage(name) {
  if (!name) {
    return null;
  }

  if (imageCache.has(name)) {
    return imageCache.get(name);
  }

  const placeholder = `https://placehold.co/256x256?text=${encodeURIComponent(name)}`;
  imageCache.set(name, placeholder);
  return placeholder;
}

export function clearCharacterImageCache() {
  imageCache.clear();
}
