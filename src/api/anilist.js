const API_URL = "https://graphql.anilist.co";

const QUERY_SEARCH = `
  query ($page:Int, $perPage:Int, $search:String, $genres:[String]) {
    Page(page:$page, perPage:$perPage) {
      media(
        search:$search,
        type:ANIME,
        genre_in:$genres,
        isAdult:false
      ) {
        id
        title { romaji english }
        coverImage { large }
        averageScore
        popularity
        genres
      }
    }
  }
`;

const QUERY_ANIME_DETAILS = `
  query ($id:Int) {
    Media(id:$id, type:ANIME) {
      id
      title { romaji english }
      coverImage { large }
      description(asHtml:false)
      averageScore
      popularity
      genres
      episodes
      status
      duration
      seasonYear
    }
  }
`;

const QUERY_GENRE_COLLECTION = `
  query {
    GenreCollection
  }
`;

const QUERY_CHARACTER = `
  query ($search:String) {
    Character(search:$search) {
      id
      name { full }
      image { large }
    }
  }
`;

const imageCache = new Map();

export async function fetchGraphQL(query, variables) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors) {
    throw new Error(payload.errors.map((item) => item.message).join(", "));
  }

  return payload.data;
}

export async function searchAnime(query, options) {
  const variables = {
    page: options && options.page ? options.page : 1,
    perPage: options && options.perPage ? options.perPage : 20,
    search: query && query.trim() ? query.trim() : undefined,
    genres: options && options.genres && options.genres.length > 0 ? options.genres : undefined,
  };

  const data = await fetchGraphQL(QUERY_SEARCH, variables);
  return data && data.Page && Array.isArray(data.Page.media) ? data.Page.media : [];
}

export async function getAnimeById(id) {
  const data = await fetchGraphQL(QUERY_ANIME_DETAILS, { id });
  return data ? data.Media : null;
}

export async function fetchGenres() {
  const data = await fetchGraphQL(QUERY_GENRE_COLLECTION);
  return Array.isArray(data && data.GenreCollection) ? data.GenreCollection : [];
}

export async function fetchCharacterImage(name) {
  if (!name) {
    return null;
  }

  if (imageCache.has(name)) {
    return imageCache.get(name);
  }

  const data = await fetchGraphQL(QUERY_CHARACTER, { search: name });
  const character = data && data.Character;
  if (!character || !character.image) {
    imageCache.set(name, null);
    return null;
  }

  const image = character.image.large || null;
  imageCache.set(name, image);
  return image;
}

export function clearCharacterImageCache() {
  imageCache.clear();
}
