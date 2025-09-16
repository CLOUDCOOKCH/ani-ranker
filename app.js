
const { useState, useEffect, useMemo, useRef } = React;

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

async function fetchGraphQL(query, variables) {
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

async function searchAnime(query, options) {
  const variables = {
    page: options && options.page ? options.page : 1,
    perPage: options && options.perPage ? options.perPage : 20,
    search: query && query.trim() ? query.trim() : undefined,
    genres: options && options.genres && options.genres.length > 0 ? options.genres : undefined,
  };

  const data = await fetchGraphQL(QUERY_SEARCH, variables);
  return data && data.Page && Array.isArray(data.Page.media) ? data.Page.media : [];
}

async function getAnimeById(id) {
  const data = await fetchGraphQL(QUERY_ANIME_DETAILS, { id });
  return data ? data.Media : null;
}

async function fetchGenres() {
  const data = await fetchGraphQL(QUERY_GENRE_COLLECTION);
  return Array.isArray(data && data.GenreCollection) ? data.GenreCollection : [];
}

async function fetchCharacterImage(name) {
  if (!name) {
    return null;
  }

  const data = await fetchGraphQL(QUERY_CHARACTER, { search: name });
  const character = data && data.Character;
  if (!character || !character.image) {
    return null;
  }
  return character.image.large || null;
}
const WAIFUS = [
  {
    name: "Rias Gremory",
    animeId: 11617,
    animeTitle: "High School DxD",
    traits: ["Royalty", "Demon", "Leader"],
    hairColor: "Crimson",
    skinTone: "Fair",
    eyeColor: "Blue",
    chest: "Voluptuous",
    grace: 8,
    intensity: 9,
    warmth: 7,
    mystique: 6,
    featured: true,
  },
  {
    name: "Akeno Himejima",
    animeId: 11617,
    animeTitle: "High School DxD",
    traits: ["Priestess", "Demon", "Charmer"],
    hairColor: "Raven",
    skinTone: "Fair",
    eyeColor: "Violet",
    chest: "Voluptuous",
    grace: 9,
    intensity: 8,
    warmth: 6,
    mystique: 7,
    featured: false,
  },
  {
    name: "Zero Two",
    animeId: 99423,
    animeTitle: "Darling in the Franxx",
    traits: ["Pilot", "Hybrid", "Rebel"],
    hairColor: "Pastel Pink",
    skinTone: "Fair",
    eyeColor: "Turquoise",
    chest: "Balanced",
    grace: 7,
    intensity: 9,
    warmth: 6,
    mystique: 8,
    featured: true,
  },
  {
    name: "Asuna Yuuki",
    animeId: 11757,
    animeTitle: "Sword Art Online",
    traits: ["Swordswoman", "Leader", "Reliable"],
    hairColor: "Chestnut",
    skinTone: "Fair",
    eyeColor: "Hazel",
    chest: "Balanced",
    grace: 9,
    intensity: 8,
    warmth: 8,
    mystique: 6,
    featured: true,
  },
  {
    name: "Rem",
    animeId: 21355,
    animeTitle: "Re:Zero",
    traits: ["Demon", "Devoted", "Support"],
    hairColor: "Sky Blue",
    skinTone: "Fair",
    eyeColor: "Azure",
    chest: "Petite",
    grace: 8,
    intensity: 7,
    warmth: 10,
    mystique: 6,
    featured: true,
  },
  {
    name: "Mikasa Ackerman",
    animeId: 16498,
    animeTitle: "Attack on Titan",
    traits: ["Soldier", "Protector", "Stoic"],
    hairColor: "Jet Black",
    skinTone: "Olive",
    eyeColor: "Gray",
    chest: "Athletic",
    grace: 8,
    intensity: 10,
    warmth: 6,
    mystique: 7,
    featured: true,
  },
  {
    name: "Yor Forger",
    animeId: 140960,
    animeTitle: "SPY x FAMILY",
    traits: ["Assassin", "Family", "Graceful"],
    hairColor: "Raven",
    skinTone: "Porcelain",
    eyeColor: "Red",
    chest: "Balanced",
    grace: 9,
    intensity: 8,
    warmth: 7,
    mystique: 8,
    featured: true,
  },
  {
    name: "Nezuko Kamado",
    animeId: 101922,
    animeTitle: "Demon Slayer",
    traits: ["Demon", "Protector", "Pure"],
    hairColor: "Black Ombre",
    skinTone: "Porcelain",
    eyeColor: "Rose",
    chest: "Petite",
    grace: 8,
    intensity: 7,
    warmth: 9,
    mystique: 7,
    featured: false,
  },
  {
    name: "Marin Kitagawa",
    animeId: 132405,
    animeTitle: "My Dress-Up Darling",
    traits: ["Cosplayer", "Sunshine", "Creative"],
    hairColor: "Honey Blonde",
    skinTone: "Fair",
    eyeColor: "Gold",
    chest: "Balanced",
    grace: 8,
    intensity: 6,
    warmth: 9,
    mystique: 5,
    featured: false,
  },
  {
    name: "Makima",
    animeId: 127230,
    animeTitle: "Chainsaw Man",
    traits: ["Leader", "Manipulator", "Calm"],
    hairColor: "Copper",
    skinTone: "Fair",
    eyeColor: "Amber",
    chest: "Balanced",
    grace: 9,
    intensity: 9,
    warmth: 4,
    mystique: 10,
    featured: false,
  },
  {
    name: "Kaguya Shinomiya",
    animeId: 101921,
    animeTitle: "Love is War",
    traits: ["Heiress", "Strategist", "Elegant"],
    hairColor: "Ink Black",
    skinTone: "Porcelain",
    eyeColor: "Ruby",
    chest: "Balanced",
    grace: 9,
    intensity: 7,
    warmth: 6,
    mystique: 8,
    featured: false,
  },
  {
    name: "Nobara Kugisaki",
    animeId: 113415,
    animeTitle: "Jujutsu Kaisen",
    traits: ["Sorcerer", "Fierce", "Stylish"],
    hairColor: "Copper Brown",
    skinTone: "Olive",
    eyeColor: "Amber",
    chest: "Athletic",
    grace: 8,
    intensity: 9,
    warmth: 6,
    mystique: 7,
    featured: false,
  },
  {
    name: "Albedo",
    animeId: 20832,
    animeTitle: "Overlord",
    traits: ["Guardian", "Demon", "Devoted"],
    hairColor: "Raven",
    skinTone: "Porcelain",
    eyeColor: "Amber",
    chest: "Voluptuous",
    grace: 9,
    intensity: 8,
    warmth: 7,
    mystique: 9,
    featured: false,
  },
  {
    name: "Rei Ayanami",
    animeId: 30,
    animeTitle: "Neon Genesis Evangelion",
    traits: ["Pilot", "Enigmatic", "Calm"],
    hairColor: "Icy Blue",
    skinTone: "Fair",
    eyeColor: "Red",
    chest: "Petite",
    grace: 8,
    intensity: 6,
    warmth: 4,
    mystique: 10,
    featured: false,
  },
  {
    name: "Hitagi Senjougahara",
    animeId: 17074,
    animeTitle: "Monogatari Series",
    traits: ["Tsundere", "Sharp", "Poised"],
    hairColor: "Indigo",
    skinTone: "Porcelain",
    eyeColor: "Magenta",
    chest: "Balanced",
    grace: 9,
    intensity: 7,
    warmth: 5,
    mystique: 8,
    featured: false,
  },
  {
    name: "Kurisu Makise",
    animeId: 9253,
    animeTitle: "Steins;Gate",
    traits: ["Scientist", "Sharp", "Compassionate"],
    hairColor: "Auburn",
    skinTone: "Fair",
    eyeColor: "Hazel",
    chest: "Balanced",
    grace: 8,
    intensity: 7,
    warmth: 8,
    mystique: 7,
    featured: false,
  },
  {
    name: "Rukia Kuchiki",
    animeId: 269,
    animeTitle: "Bleach",
    traits: ["Soul Reaper", "Calm", "Artist"],
    hairColor: "Raven",
    skinTone: "Fair",
    eyeColor: "Violet",
    chest: "Petite",
    grace: 8,
    intensity: 8,
    warmth: 6,
    mystique: 7,
    featured: false,
  },
  {
    name: "Nami",
    animeId: 21,
    animeTitle: "One Piece",
    traits: ["Navigator", "Strategist", "Bold"],
    hairColor: "Tangerine",
    skinTone: "Sun-kissed",
    eyeColor: "Brown",
    chest: "Voluptuous",
    grace: 7,
    intensity: 7,
    warmth: 8,
    mystique: 6,
    featured: false,
  },
  {
    name: "Hinata Hyuga",
    animeId: 20,
    animeTitle: "Naruto",
    traits: ["Ninja", "Gentle", "Resilient"],
    hairColor: "Midnight",
    skinTone: "Fair",
    eyeColor: "Lavender",
    chest: "Balanced",
    grace: 9,
    intensity: 6,
    warmth: 9,
    mystique: 6,
    featured: false,
  },
  {
    name: "Shiki Ryougi",
    animeId: 6954,
    animeTitle: "The Garden of Sinners",
    traits: ["Mystic", "Assassin", "Stoic"],
    hairColor: "Midnight",
    skinTone: "Porcelain",
    eyeColor: "Blue",
    chest: "Athletic",
    grace: 9,
    intensity: 9,
    warmth: 4,
    mystique: 10,
    featured: false,
  },
];
const WAIFU_ATTRIBUTE_LABELS = {
  name: "Name",
  grace: "Grace",
  intensity: "Intensity",
  warmth: "Warmth",
  mystique: "Mystique",
};

function sortWaifuList(list, key, direction) {
  const sorted = list.slice();
  if (key === "name") {
    sorted.sort((a, b) =>
      direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return sorted;
  }

  sorted.sort((a, b) => {
    const left = typeof a[key] === "number" ? a[key] : 0;
    const right = typeof b[key] === "number" ? b[key] : 0;
    if (right === left) {
      return a.name.localeCompare(b.name);
    }
    return direction === "asc" ? left - right : right - left;
  });

  return sorted;
}

function createIcon(children) {
  return function Icon(props) {
    return React.createElement(
      "svg",
      Object.assign(
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
        props
      ),
      children
    );
  };
}

const Icons = {
  Search: createIcon([
    React.createElement("circle", { key: "c", cx: "11", cy: "11", r: "6" }),
    React.createElement("line", { key: "l", x1: "16.5", y1: "16.5", x2: "21", y2: "21" }),
  ]),
  Sort: createIcon([
    React.createElement("path", { key: "a", d: "M6 4v12" }),
    React.createElement("path", { key: "b", d: "M6 16l-2.5-2.5" }),
    React.createElement("path", { key: "c", d: "M6 16l2.5-2.5" }),
    React.createElement("path", { key: "d", d: "M18 20V8" }),
    React.createElement("path", { key: "e", d: "M18 8l-2.5 2.5" }),
    React.createElement("path", { key: "f", d: "M18 8l2.5 2.5" }),
  ]),
  Chevron: createIcon([
    React.createElement("polyline", { key: "a", points: "8 10 12 14 16 10" }),
  ]),
  Tag: createIcon([
    React.createElement("path", { key: "a", d: "M20 12l-8 8-9-9V4h7z" }),
    React.createElement("circle", { key: "b", cx: "7.5", cy: "8.5", r: "1.25" }),
  ]),
  Star: createIcon([
    React.createElement("path", { key: "a", d: "M12 4l2 4.9 5.2.4-3.9 3.3 1.2 5.1L12 15.7 7.5 17.7l1.2-5.1-4.2-3.3 5.2-.4z" }),
  ]),
  StarSolid: function StarSolid(props) {
    return React.createElement(
      "svg",
      Object.assign(
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "none",
        },
        props
      ),
      React.createElement("path", {
        d: "M12 3.4l2.3 5 5.5.4-4.2 3.4 1.3 5.3L12 14.9l-4.9 2.6 1.3-5.3-4.2-3.4 5.5-.4z",
      })
    );
  },
  Spark: createIcon([
    React.createElement("path", { key: "a", d: "M12 4v4" }),
    React.createElement("path", { key: "b", d: "M12 16v4" }),
    React.createElement("path", { key: "c", d: "M4 12h4" }),
    React.createElement("path", { key: "d", d: "M16 12h4" }),
    React.createElement("path", { key: "e", d: "M6.8 6.8l2.6 2.6" }),
    React.createElement("path", { key: "f", d: "M14.6 14.6l2.6 2.6" }),
    React.createElement("path", { key: "g", d: "M17.2 6.8l-2.6 2.6" }),
    React.createElement("path", { key: "h", d: "M9.4 14.6l-2.6 2.6" }),
  ]),
  Flame: createIcon([
    React.createElement("path", { key: "a", d: "M12 3.5s4 3.3 4 7.1c0 2.4-1.8 4.4-4 4.4s-4-2-4-4.4c0-3.8 4-7.1 4-7.1z" }),
    React.createElement("path", { key: "b", d: "M12 15c2.2 0 4 1.6 4 3.6 0 1.7-1.7 2.9-4 2.9s-4-1.2-4-2.9c0-2 1.8-3.6 4-3.6z" }),
  ]),
  ArrowRight: createIcon([
    React.createElement("path", { key: "a", d: "M5 12h14" }),
    React.createElement("polyline", { key: "b", points: "13 6 19 12 13 18" }),
  ]),
  Close: createIcon([
    React.createElement("line", { key: "a", x1: "6", y1: "6", x2: "18", y2: "18" }),
    React.createElement("line", { key: "b", x1: "6", y1: "18", x2: "18", y2: "6" }),
  ]),
  ArrowUpDown: createIcon([
    React.createElement("polyline", { key: "a", points: "8 7 12 3 16 7" }),
    React.createElement("polyline", { key: "b", points: "8 17 12 21 16 17" }),
    React.createElement("line", { key: "c", x1: "12", y1: "3", x2: "12", y2: "21" }),
  ]),
};
function WaifuSelector(props) {
  const attributeLabel = WAIFU_ATTRIBUTE_LABELS[props.sortKey] || "Score";
  const selection = props.selection || "";
  const filtered = props.waifus ? props.waifus : [];
  const featuredVisible = props.visibleWaifus ? props.visibleWaifus : filtered;
  const selectedWaifu = props.selectedWaifu || null;

  const filtersAreActive =
    (props.activeTraits && props.activeTraits.length > 0) ||
    (props.activeHairColors && props.activeHairColors.length > 0) ||
    (props.activeSkinTones && props.activeSkinTones.length > 0) ||
    (props.activeChestSizes && props.activeChestSizes.length > 0);

  const filterToggleLabel = props.filtersOpen ? "Hide waifu filters" : "Refine waifu list";

  const metricFor = (waifu) => {
    const value = typeof waifu[props.sortKey] === "number" ? waifu[props.sortKey] : null;
    return value != null ? `${attributeLabel} ${value}/10` : waifu.animeTitle;
  };

  const previewMeta = selectedWaifu
    ? `${selectedWaifu.hairColor} hair · ${selectedWaifu.skinTone} skin · ${selectedWaifu.chest}`
    : null;

  return React.createElement(
    "section",
    { className: "waifu-selector surface-card" },
    React.createElement(
      "div",
      { className: "waifu-selector__header" },
      React.createElement("h2", { className: "waifu-selector__title" }, "Signature muses"),
      React.createElement(
        "p",
        { className: "waifu-selector__subtitle" },
        "Choose a muse to open her series or tailor the roster to your taste."
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "section-toggle",
          onClick: props.onToggleFilters,
        },
        filterToggleLabel
      )
    ),
    React.createElement(
      "div",
      { className: "waifu-selector__preview" },
      selectedWaifu
        ? React.createElement(
            "div",
            { className: "waifu-selector__preview-card" },
            props.selectedWaifuImageLoading
              ? React.createElement(
                  "p",
                  { className: "waifu-selector__status" },
                  "Fetching portrait..."
                )
              : props.selectedWaifuImageError
              ? React.createElement(
                  "p",
                  { className: "waifu-selector__status error" },
                  props.selectedWaifuImageError
                )
              : props.selectedWaifuImage
              ? React.createElement("img", {
                  src: props.selectedWaifuImage,
                  alt: selectedWaifu.name,
                  className: "waifu-selector__preview-image",
                })
              : React.createElement(
                  "div",
                  { className: "waifu-selector__preview-placeholder" },
                  "No portrait available"
                ),
            React.createElement(
              "div",
              { className: "waifu-selector__preview-content" },
              React.createElement("h3", null, selectedWaifu.name),
              React.createElement("p", null, selectedWaifu.animeTitle),
              React.createElement(
                "p",
                { className: "waifu-selector__preview-meta" },
                previewMeta
              ),
              React.createElement(
                "div",
                { className: "waifu-selector__preview-traits" },
                selectedWaifu.traits.map((trait) =>
                  React.createElement("span", { key: trait }, trait)
                )
              )
            )
          )
        : React.createElement(
            "div",
            { className: "waifu-selector__preview-empty" },
            "Select a muse to see her spotlight."
          )
    ),
    props.filtersOpen
      ? React.createElement(
          "div",
          { className: "waifu-selector__filters" },
          React.createElement(
            "div",
            { className: "waifu-selector__controls" },
            React.createElement(
              "div",
              { className: "field" },
              React.createElement("span", { className: "field__label" }, "Sort muses"),
              React.createElement(
                "div",
                { className: "select-shell" },
                React.createElement(Icons.Sort, { className: "select-shell__icon" }),
                React.createElement(
                  "select",
                  {
                    value: props.sortKey,
                    onChange: (event) =>
                      props.onSortKeyChange && props.onSortKeyChange(event.target.value),
                  },
                  React.createElement("option", { value: "grace" }, "Grace"),
                  React.createElement("option", { value: "intensity" }, "Intensity"),
                  React.createElement("option", { value: "warmth" }, "Warmth"),
                  React.createElement("option", { value: "mystique" }, "Mystique"),
                  React.createElement("option", { value: "name" }, "Name")
                ),
                React.createElement(Icons.Chevron, { className: "select-shell__chevron" })
              )
            ),
            React.createElement(
              "div",
              { className: "waifu-selector__direction" },
              React.createElement(
                "button",
                {
                  type: "button",
                  onClick: () => props.onSortDirectionToggle && props.onSortDirectionToggle(),
                },
                React.createElement(Icons.ArrowUpDown, null),
                props.sortDirection === "asc" ? "Ascending" : "Descending"
              )
            )
          ),
          props.traits && props.traits.length > 0
            ? React.createElement(
                "div",
                { className: "waifu-selector__traits" },
                React.createElement("span", { className: "field__label" }, "Traits"),
                React.createElement(
                  "div",
                  { className: "waifu-selector__trait-list" },
                  props.traits.map((trait) => {
                    const isActive = props.activeTraits && props.activeTraits.indexOf(trait) !== -1;
                    const className = isActive ? "trait-chip trait-chip--active" : "trait-chip";
                    return React.createElement(
                      "button",
                      {
                        key: trait,
                        type: "button",
                        className,
                        onClick: () => props.onToggleTrait && props.onToggleTrait(trait),
                        "aria-pressed": isActive,
                      },
                      trait
                    );
                  }),
                  props.activeTraits && props.activeTraits.length > 0
                    ? React.createElement(
                        "button",
                        {
                          type: "button",
                          className: "trait-chip",
                          onClick: () => props.onClearTraits && props.onClearTraits(),
                        },
                        "Clear"
                      )
                    : null
                )
              )
            : null,
          props.hairColors && props.hairColors.length > 0
            ? React.createElement(
                "div",
                { className: "waifu-selector__traits" },
                React.createElement("span", { className: "field__label" }, "Hair"),
                React.createElement(
                  "div",
                  { className: "waifu-selector__trait-list" },
                  props.hairColors.map((shade) => {
                    const isActive =
                      props.activeHairColors && props.activeHairColors.indexOf(shade) !== -1;
                    const className = isActive ? "trait-chip trait-chip--active" : "trait-chip";
                    return React.createElement(
                      "button",
                      {
                        key: shade,
                        type: "button",
                        className,
                        onClick: () => props.onToggleHair && props.onToggleHair(shade),
                        "aria-pressed": isActive,
                      },
                      shade
                    );
                  }),
                  props.activeHairColors && props.activeHairColors.length > 0
                    ? React.createElement(
                        "button",
                        {
                          type: "button",
                          className: "trait-chip",
                          onClick: () => props.onClearHair && props.onClearHair(),
                        },
                        "Clear"
                      )
                    : null
                )
              )
            : null,
          props.skinTones && props.skinTones.length > 0
            ? React.createElement(
                "div",
                { className: "waifu-selector__traits" },
                React.createElement("span", { className: "field__label" }, "Skin"),
                React.createElement(
                  "div",
                  { className: "waifu-selector__trait-list" },
                  props.skinTones.map((tone) => {
                    const isActive =
                      props.activeSkinTones && props.activeSkinTones.indexOf(tone) !== -1;
                    const className = isActive ? "trait-chip trait-chip--active" : "trait-chip";
                    return React.createElement(
                      "button",
                      {
                        key: tone,
                        type: "button",
                        className,
                        onClick: () => props.onToggleSkin && props.onToggleSkin(tone),
                        "aria-pressed": isActive,
                      },
                      tone
                    );
                  }),
                  props.activeSkinTones && props.activeSkinTones.length > 0
                    ? React.createElement(
                        "button",
                        {
                          type: "button",
                          className: "trait-chip",
                          onClick: () => props.onClearSkin && props.onClearSkin(),
                        },
                        "Clear"
                      )
                    : null
                )
              )
            : null,
          props.chestSizes && props.chestSizes.length > 0
            ? React.createElement(
                "div",
                { className: "waifu-selector__traits" },
                React.createElement("span", { className: "field__label" }, "Silhouette"),
                React.createElement(
                  "div",
                  { className: "waifu-selector__trait-list" },
                  props.chestSizes.map((size) => {
                    const isActive =
                      props.activeChestSizes && props.activeChestSizes.indexOf(size) !== -1;
                    const className = isActive ? "trait-chip trait-chip--active" : "trait-chip";
                    return React.createElement(
                      "button",
                      {
                        key: size,
                        type: "button",
                        className,
                        onClick: () => props.onToggleChest && props.onToggleChest(size),
                        "aria-pressed": isActive,
                      },
                      size
                    );
                  }),
                  props.activeChestSizes && props.activeChestSizes.length > 0
                    ? React.createElement(
                        "button",
                        {
                          type: "button",
                          className: "trait-chip",
                          onClick: () => props.onClearChest && props.onClearChest(),
                        },
                        "Clear"
                      )
                    : null
                )
              )
            : null
        )
      : null,
    filtered.length > 0 && featuredVisible.length === 0
      ? React.createElement(
          "p",
          { className: "waifu-selector__empty" },
          "No muse matches the current filters."
        )
      : null,
    featuredVisible.length > 0
      ? React.createElement(
          "div",
          { className: "waifu-selector__gallery" },
          featuredVisible.map((item) => {
            const className =
              "waifu-pill" + (selection === item.name ? " waifu-pill--active" : "");
            return React.createElement(
              "button",
              {
                type: "button",
                key: item.name,
                className,
                onClick: () => props.onSelect && props.onSelect(item.name),
              },
              React.createElement("strong", null, item.name),
              React.createElement("span", null, item.animeTitle),
              React.createElement("span", { className: "waifu-pill__metric" }, metricFor(item))
            );
          })
        )
      : null,
    filtered.length > featuredVisible.length && !filtersAreActive
      ? React.createElement(
          "button",
          {
            type: "button",
            className: "waifu-selector__show-more section-toggle",
            onClick: props.onToggleShowAll,
          },
          props.showAll ? "Show featured only" : "Show the full roster"
        )
      : null,
    React.createElement(
      "p",
      { className: "waifu-selector__note" },
      "Tap a muse or pick from the list to open her series instantly."
    )
  );
}
function FilterBar(props) {
  return React.createElement(
    "section",
    { className: "filter-bar surface-card" },
    React.createElement(
      "div",
      { className: "field" },
      React.createElement("span", { className: "field__label" }, "Search"),
      React.createElement(
        "div",
        { className: "input-shell" },
        React.createElement(Icons.Search, { className: "input-shell__icon" }),
        React.createElement("input", {
          className: "input-shell__control",
          type: "search",
          placeholder: "Search by title or keyword",
          value: props.search,
          onChange: (event) => props.onSearchChange(event.target.value),
        })
      )
    ),
    React.createElement(
      "div",
      { className: "field" },
      React.createElement("span", { className: "field__label" }, "Sort"),
      React.createElement(
        "div",
        { className: "select-shell" },
        React.createElement(Icons.Sort, { className: "select-shell__icon" }),
        React.createElement(
          "select",
          {
            value: props.sort,
            onChange: (event) => props.onSortChange(event.target.value),
          },
          React.createElement("option", { value: "POPULARITY" }, "Popularity"),
          React.createElement("option", { value: "AVERAGE_SCORE" }, "Average score"),
          React.createElement("option", { value: "MY_RATING" }, "My rating")
        ),
        React.createElement(Icons.Chevron, { className: "select-shell__chevron" })
      )
    ),
    React.createElement(
      "div",
      { className: "filter-bar__genres field" },
      React.createElement("span", { className: "field__label" }, "Genres"),
      React.createElement(
        "div",
        { className: "chip-list" },
        props.genres && props.genres.length > 0
          ? props.genres.map((genre) => {
              const isChecked = props.selectedGenres.indexOf(genre) !== -1;
              const classes = isChecked ? "chip chip--active" : "chip";
              const inputId = `genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return React.createElement(
                "label",
                { key: genre, htmlFor: inputId, className: classes },
                React.createElement(Icons.Tag, { className: "chip__icon" }),
                React.createElement("span", null, genre),
                React.createElement("input", {
                  id: inputId,
                  type: "checkbox",
                  checked: isChecked,
                  onChange: () => props.onGenreToggle(genre),
                })
              );
            })
          : React.createElement(
              "p",
              { className: "chip-list__empty" },
              "Genres will appear once content loads."
            )
      )
    )
  );
}

function Metric(props) {
  return React.createElement(
    "span",
    { className: "metric" },
    React.createElement(props.icon, { className: "metric__icon" }),
    React.createElement("span", null, props.label)
  );
}

function StarRating(props) {
  const [hovered, setHovered] = useState(null);

  const handleSelect = (score) => {
    if (props.value === score) {
      props.onChange(null);
    } else {
      props.onChange(score);
    }
  };

  const stars = Array.from({ length: 10 }, (_, index) => {
    const score = index + 1;
    const isActive = hovered != null ? score <= hovered : props.value != null && score <= props.value;
    const isPressed = props.value === score;
    return React.createElement(
      "button",
      {
        key: score,
        type: "button",
        className: "star-button",
        "data-active": props.value != null && score <= props.value ? "true" : "false",
        "data-hover": hovered != null && score <= hovered ? "true" : "false",
        onClick: () => handleSelect(score),
        onMouseEnter: () => setHovered(score),
        onMouseLeave: () => setHovered(null),
        onFocus: () => setHovered(score),
        onBlur: () => setHovered(null),
        "aria-label": `Rate ${score} ${score === 1 ? "star" : "stars"}`,
        "aria-pressed": isPressed,
      },
      isActive
        ? React.createElement(Icons.StarSolid, { className: "star-icon" })
        : React.createElement(Icons.Star, { className: "star-icon" })
    );
  });

  return React.createElement(
    "div",
    { className: "star-rating" },
    React.createElement(
      "div",
      { className: "star-rating__stars", role: "radiogroup", "aria-label": "My rating" },
      stars
    ),
    React.createElement(
      "span",
      { className: "rating-control__value" },
      props.value != null ? `${props.value}/10` : "Tap a star to rate"
    )
  );
}

function AnimeCard(props) {
  const displayTitle =
    (props.anime.title && (props.anime.title.english || props.anime.title.romaji)) || "Untitled";

  return React.createElement(
    "article",
    { className: "anime-card" },
    React.createElement(
      "button",
      {
        type: "button",
        className: "anime-card__cover",
        onClick: () => props.onOpenDetails(props.anime.id),
      },
      props.anime.coverImage && props.anime.coverImage.large
        ? React.createElement("img", {
            src: props.anime.coverImage.large,
            alt: displayTitle,
            loading: "lazy",
          })
        : React.createElement("div", { className: "anime-card__placeholder" }, "Cover unavailable")
    ),
    React.createElement(
      "div",
      { className: "anime-card__content" },
      React.createElement("h3", { className: "anime-card__title", title: displayTitle }, displayTitle),
      React.createElement(
        "div",
        { className: "anime-card__metrics" },
        React.createElement(Metric, {
          icon: Icons.Star,
          label: `Score ${props.anime.averageScore != null ? props.anime.averageScore : "—"}`,
        }),
        React.createElement(Metric, {
          icon: Icons.Flame,
          label: `Popularity ${props.anime.popularity != null ? props.anime.popularity : "—"}`,
        })
      ),
      React.createElement(
        "div",
        { className: "anime-card__actions" },
        React.createElement(
          "div",
          { className: "rating-control" },
          React.createElement(
            "span",
            { className: "rating-control__label" },
            React.createElement(Icons.Spark, { className: "metric__icon" }),
            "My Rating"
          ),
          React.createElement(StarRating, {
            value:
              typeof props.myRating === "number" && !Number.isNaN(props.myRating)
                ? props.myRating
                : null,
            onChange: (rating) => props.onRatingChange(props.anime.id, rating),
          })
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "button button--primary",
            onClick: () => props.onOpenDetails(props.anime.id),
          },
          "View details",
          React.createElement(Icons.ArrowRight, { className: "button__icon" })
        )
      )
    )
  );
}

function DetailModal(props) {
  if (!props.isOpen) {
    return null;
  }

  const data = props.data;
  const title = data && data.title ? data.title.english || data.title.romaji : "";
  const attributeKey = props.sortKey;
  const attributeLabel = WAIFU_ATTRIBUTE_LABELS[attributeKey] || "Score";

  return React.createElement(
    "div",
    { className: "detail-overlay", role: "dialog", "aria-modal": "true" },
    React.createElement(
      "div",
      { className: "detail-modal" },
      React.createElement(
        "button",
        {
          type: "button",
          className: "detail-modal__close",
          onClick: props.onClose,
          "aria-label": "Close details",
        },
        React.createElement(Icons.Close, { width: 18, height: 18 })
      ),
      props.loading
        ? React.createElement("p", { className: "status-message" }, "Gathering details...")
        : null,
      props.error
        ? React.createElement("p", { className: "status-message error" }, props.error)
        : null,
      data
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "header",
              { className: "detail-modal__header" },
              data.coverImage && data.coverImage.large
                ? React.createElement(
                    "div",
                    { className: "detail-modal__cover" },
                    React.createElement("img", {
                      src: data.coverImage.large,
                      alt: title || "Anime cover",
                    })
                  )
                : null,
              React.createElement(
                "div",
                null,
                React.createElement("h2", { className: "detail-modal__title" }, title),
                React.createElement(
                  "div",
                  { className: "detail-modal__meta" },
                  React.createElement(Metric, {
                    icon: Icons.Star,
                    label: `Average ${data.averageScore != null ? data.averageScore : "—"}`,
                  }),
                  React.createElement(Metric, {
                    icon: Icons.Flame,
                    label: `Popularity ${data.popularity != null ? data.popularity : "—"}`,
                  }),
                  data.episodes != null
                    ? React.createElement(Metric, {
                        icon: Icons.Spark,
                        label: `Episodes ${data.episodes}`,
                      })
                    : null,
                  data.status
                    ? React.createElement(Metric, {
                        icon: Icons.Tag,
                        label: data.status,
                      })
                    : null,
                  data.duration != null
                    ? React.createElement(Metric, {
                        icon: Icons.Tag,
                        label: `${data.duration} min`,
                      })
                    : null,
                  data.seasonYear
                    ? React.createElement(Metric, {
                        icon: Icons.Tag,
                        label: `${data.seasonYear}`,
                      })
                    : null
                ),
                data.genres && data.genres.length > 0
                  ? React.createElement(
                      "p",
                      { className: "detail-modal__genres" },
                      data.genres.join(" · ")
                    )
                  : null
              )
            ),
            data.description
              ? React.createElement(
                  "p",
                  { className: "detail-modal__description" },
                  data.description
                )
              : null,
            props.waifus && props.waifus.length > 0
              ? React.createElement(
                  "div",
                  { className: "detail-modal__waifus" },
                  React.createElement("h3", { className: "field__label" }, "Beloved waifus"),
                  React.createElement(
                    "div",
                    { className: "detail-modal__waifu-list" },
                    props.waifus.map((waifu) => {
                      const value = typeof waifu[attributeKey] === "number" ? waifu[attributeKey] : null;
                      const metricText =
                        value != null ? `${attributeLabel} ${value}/10` : waifu.animeTitle;
                      const className =
                        "waifu-pill" +
                        (props.activeWaifu === waifu.name ? " waifu-pill--active" : "");
                      return React.createElement(
                        "button",
                        {
                          type: "button",
                          key: waifu.name,
                          className,
                          onClick: () =>
                            props.onSelectWaifu ? props.onSelectWaifu(waifu.name) : undefined,
                        },
                        React.createElement("strong", null, waifu.name),
                        React.createElement("span", null, waifu.animeTitle),
                        React.createElement("span", { className: "waifu-pill__metric" }, metricText)
                      );
                    })
                  )
                )
              : null
          )
        : null
    )
  );
}
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState("POPULARITY");
  const [ratings, setRatings] = useState({});

  const [waifuSelection, setWaifuSelection] = useState("");
  const [waifuSortKey, setWaifuSortKey] = useState("grace");
  const [waifuSortDirection, setWaifuSortDirection] = useState("desc");
  const [waifuTraitFilters, setWaifuTraitFilters] = useState([]);
  const [waifuHairFilters, setWaifuHairFilters] = useState([]);
  const [waifuSkinFilters, setWaifuSkinFilters] = useState([]);
  const [waifuChestFilters, setWaifuChestFilters] = useState([]);
  const [showAllWaifus, setShowAllWaifus] = useState(false);
  const [waifuFiltersOpen, setWaifuFiltersOpen] = useState(false);
  const [animeFiltersOpen, setAnimeFiltersOpen] = useState(false);

  const [selectedWaifuImage, setSelectedWaifuImage] = useState(null);
  const [selectedWaifuImageLoading, setSelectedWaifuImageLoading] = useState(false);
  const [selectedWaifuImageError, setSelectedWaifuImageError] = useState(null);
  const waifuImageRequestRef = useRef(0);

  const [detailId, setDetailId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("ani-ranker-ratings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setRatings(parsed);
        }
      } catch (err) {
        console.warn("Failed to parse saved ratings", err);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ani-ranker-ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    let alive = true;
    fetchGenres()
      .then((genres) => {
        if (!alive) return;
        const sorted = Array.isArray(genres) ? genres.slice().sort((a, b) => a.localeCompare(b)) : [];
        setGenreOptions(sorted);
      })
      .catch((err) => {
        console.error("Failed to load genres", err);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    const timeoutId = window.setTimeout(() => {
      searchAnime(searchTerm, { perPage: 24, genres: selectedGenres })
        .then((results) => {
          if (!active) return;
          setAnime(Array.isArray(results) ? results : []);
          setIsLoading(false);
        })
        .catch((err) => {
          if (!active) return;
          console.error(err);
          setError(err instanceof Error ? err.message : "Failed to fetch anime");
          setIsLoading(false);
        });
    }, 320);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm, selectedGenres]);

  useEffect(() => {
    if (genreOptions.length > 0) {
      return;
    }
    if (!anime || anime.length === 0) {
      return;
    }
    const derived = Array.from(
      new Set(
        anime.reduce((acc, item) => {
          if (item.genres && Array.isArray(item.genres)) {
            item.genres.forEach((genre) => acc.push(genre));
          }
          return acc;
        }, [])
      )
    ).sort((a, b) => a.localeCompare(b));
    if (derived.length > 0) {
      setGenreOptions(derived);
    }
  }, [anime, genreOptions.length]);

  useEffect(() => {
    if (detailId == null) {
      return;
    }
    const matching = WAIFUS.filter((item) => item.animeId === detailId);
    if (matching.length === 0) {
      return;
    }
    const alreadySelected = matching.some((item) => item.name === waifuSelection);
    if (!alreadySelected) {
      setWaifuSelection(matching[0].name);
    }
  }, [detailId, waifuSelection]);

  const waifuTraits = useMemo(() => {
    return Array.from(new Set(WAIFUS.flatMap((item) => item.traits))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const waifuHairColors = useMemo(() => {
    return Array.from(new Set(WAIFUS.map((item) => item.hairColor))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const waifuSkinTones = useMemo(() => {
    return Array.from(new Set(WAIFUS.map((item) => item.skinTone))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const waifuChestSizes = useMemo(() => {
    return Array.from(new Set(WAIFUS.map((item) => item.chest))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  const waifuList = useMemo(() => {
    let list = WAIFUS.slice();
    if (waifuTraitFilters.length > 0) {
      list = list.filter((item) =>
        waifuTraitFilters.every((trait) => item.traits && item.traits.indexOf(trait) !== -1)
      );
    }
    if (waifuHairFilters.length > 0) {
      list = list.filter((item) => waifuHairFilters.indexOf(item.hairColor) !== -1);
    }
    if (waifuSkinFilters.length > 0) {
      list = list.filter((item) => waifuSkinFilters.indexOf(item.skinTone) !== -1);
    }
    if (waifuChestFilters.length > 0) {
      list = list.filter((item) => waifuChestFilters.indexOf(item.chest) !== -1);
    }
    return sortWaifuList(list, waifuSortKey, waifuSortDirection);
  }, [
    waifuTraitFilters,
    waifuHairFilters,
    waifuSkinFilters,
    waifuChestFilters,
    waifuSortKey,
    waifuSortDirection,
  ]);

  const filtersActive =
    waifuTraitFilters.length > 0 ||
    waifuHairFilters.length > 0 ||
    waifuSkinFilters.length > 0 ||
    waifuChestFilters.length > 0;

  const visibleWaifus = useMemo(() => {
    if (filtersActive || showAllWaifus) {
      return waifuList;
    }
    const featured = waifuList.filter((item) => item.featured);
    return featured.length > 0 ? featured : waifuList;
  }, [filtersActive, showAllWaifus, waifuList]);

  const selectedWaifu = useMemo(() => {
    return WAIFUS.find((item) => item.name === waifuSelection) || null;
  }, [waifuSelection]);

  const detailWaifus = useMemo(() => {
    if (detailId == null) {
      return [];
    }
    const list = WAIFUS.filter((item) => item.animeId === detailId);
    return sortWaifuList(list, waifuSortKey, waifuSortDirection);
  }, [detailId, waifuSortDirection, waifuSortKey]);

  const sortedAnime = useMemo(() => {
    const list = Array.isArray(anime) ? anime.slice() : [];

    const fallbackSort = (a, b) => {
      const left = a && a.popularity != null ? a.popularity : 0;
      const right = b && b.popularity != null ? b.popularity : 0;
      return right - left;
    };

    if (sortBy === "AVERAGE_SCORE") {
      return list.sort((first, second) => {
        const left = first && first.averageScore != null ? first.averageScore : 0;
        const right = second && second.averageScore != null ? second.averageScore : 0;
        if (right === left) {
          return fallbackSort(first, second);
        }
        return right - left;
      });
    }

    if (sortBy === "MY_RATING") {
      return list.sort((first, second) => {
        const left = ratings && ratings[first.id] != null ? ratings[first.id] : -1;
        const right = ratings && ratings[second.id] != null ? ratings[second.id] : -1;
        if (right === left) {
          return fallbackSort(first, second);
        }
        return right - left;
      });
    }

    return list.sort(fallbackSort);
  }, [anime, ratings, sortBy]);

  const handleRatingChange = (id, rating) => {
    setRatings((current) => {
      const next = Object.assign({}, current);
      if (rating === null || rating === undefined) {
        delete next[id];
      } else {
        next[id] = rating;
      }
      return next;
    });
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((current) => {
      if (current.indexOf(genre) !== -1) {
        return current.filter((item) => item !== genre);
      }
      return current.concat(genre);
    });
  };

  const openDetails = (id) => {
    setDetailId(id);
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(true);

    getAnimeById(id)
      .then((data) => {
        setDetailData(data);
        setDetailLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setDetailError(err instanceof Error ? err.message : "Failed to load details");
        setDetailLoading(false);
      });
  };

  const handleWaifuSelect = (name) => {
    const value = name || "";
    setWaifuSelection(value);

    if (!value) {
      waifuImageRequestRef.current = 0;
      setSelectedWaifuImage(null);
      setSelectedWaifuImageError(null);
      setSelectedWaifuImageLoading(false);
      return;
    }

    const requestId = Date.now();
    waifuImageRequestRef.current = requestId;
    setSelectedWaifuImage(null);
    setSelectedWaifuImageLoading(true);
    setSelectedWaifuImageError(null);

    fetchCharacterImage(value)
      .then((image) => {
        if (waifuImageRequestRef.current !== requestId) {
          return;
        }
        setSelectedWaifuImage(image);
        setSelectedWaifuImageLoading(false);
      })
      .catch((err) => {
        if (waifuImageRequestRef.current !== requestId) {
          return;
        }
        setSelectedWaifuImage(null);
        setSelectedWaifuImageError(err instanceof Error ? err.message : "Unable to fetch portrait");
        setSelectedWaifuImageLoading(false);
      });

    const entry = WAIFUS.find((item) => item.name === value);
    if (entry) {
      if (entry.animeTitle && entry.animeTitle !== searchTerm) {
        setSearchTerm(entry.animeTitle);
      }
      if (entry.animeId !== detailId) {
        openDetails(entry.animeId);
      }
    }
  };

  const toggleWaifuTrait = (trait) => {
    setWaifuTraitFilters((current) => {
      if (current.indexOf(trait) !== -1) {
        return current.filter((value) => value !== trait);
      }
      return current.concat(trait);
    });
  };

  const toggleWaifuHair = (shade) => {
    setWaifuHairFilters((current) => {
      if (current.indexOf(shade) !== -1) {
        return current.filter((value) => value !== shade);
      }
      return current.concat(shade);
    });
  };

  const toggleWaifuSkin = (tone) => {
    setWaifuSkinFilters((current) => {
      if (current.indexOf(tone) !== -1) {
        return current.filter((value) => value !== tone);
      }
      return current.concat(tone);
    });
  };

  const toggleWaifuChest = (size) => {
    setWaifuChestFilters((current) => {
      if (current.indexOf(size) !== -1) {
        return current.filter((value) => value !== size);
      }
      return current.concat(size);
    });
  };

  const clearTraits = () => setWaifuTraitFilters([]);
  const clearHair = () => setWaifuHairFilters([]);
  const clearSkin = () => setWaifuSkinFilters([]);
  const clearChest = () => setWaifuChestFilters([]);

  const toggleWaifuSortDirection = () => {
    setWaifuSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
  };

  const closeDetails = () => {
    setDetailId(null);
    setDetailData(null);
    setDetailError(null);
  };

  return React.createElement(
    "div",
    { className: "app" },
    React.createElement(
      "header",
      { className: "app__header" },
      React.createElement("h1", null, "AniRanker"),
      React.createElement(
        "p",
        null,
        "Curate a personal library of the stories that move you."
      )
    ),
    React.createElement(WaifuSelector, {
      waifus: waifuList,
      visibleWaifus: visibleWaifus,
      selection: waifuSelection,
      selectedWaifu: selectedWaifu,
      selectedWaifuImage: selectedWaifuImage,
      selectedWaifuImageLoading: selectedWaifuImageLoading,
      selectedWaifuImageError: selectedWaifuImageError,
      sortKey: waifuSortKey,
      sortDirection: waifuSortDirection,
      onSortKeyChange: setWaifuSortKey,
      onSortDirectionToggle: toggleWaifuSortDirection,
      traits: waifuTraits,
      activeTraits: waifuTraitFilters,
      onToggleTrait: toggleWaifuTrait,
      onClearTraits: clearTraits,
      hairColors: waifuHairColors,
      activeHairColors: waifuHairFilters,
      onToggleHair: toggleWaifuHair,
      onClearHair: clearHair,
      skinTones: waifuSkinTones,
      activeSkinTones: waifuSkinFilters,
      onToggleSkin: toggleWaifuSkin,
      onClearSkin: clearSkin,
      chestSizes: waifuChestSizes,
      activeChestSizes: waifuChestFilters,
      onToggleChest: toggleWaifuChest,
      onClearChest: clearChest,
      filtersOpen: waifuFiltersOpen,
      onToggleFilters: () => setWaifuFiltersOpen((open) => !open),
      showAll: showAllWaifus,
      onToggleShowAll: () => setShowAllWaifus((value) => !value),
      onSelect: handleWaifuSelect,
    }),
    React.createElement(
      "button",
      {
        type: "button",
        className: "section-toggle",
        onClick: () => setAnimeFiltersOpen((open) => !open),
      },
      animeFiltersOpen ? "Hide search filters" : "Show search filters"
    ),
    animeFiltersOpen
      ? React.createElement(FilterBar, {
          search: searchTerm,
          onSearchChange: setSearchTerm,
          genres: genreOptions,
          selectedGenres,
          onGenreToggle: toggleGenre,
          sort: sortBy,
          onSortChange: setSortBy,
        })
      : null,
    React.createElement(
      "main",
      null,
      isLoading
        ? React.createElement("p", { className: "status-message" }, "Loading selections...")
        : null,
      error
        ? React.createElement(
            "p",
            { className: "status-message error" },
            error
          )
        : null,
      !isLoading && !error && sortedAnime.length === 0
        ? React.createElement(
            "p",
            { className: "status-message" },
            "No titles match yet. Try adjusting your filters."
          )
        : null,
      React.createElement(
        "section",
        { className: "anime-grid" },
        sortedAnime.map((item) =>
          React.createElement(AnimeCard, {
            key: item.id,
            anime: item,
            myRating: ratings[item.id],
            onRatingChange: handleRatingChange,
            onOpenDetails: openDetails,
          })
        )
      )
    ),
    React.createElement(DetailModal, {
      isOpen: detailId !== null,
      data: detailData,
      loading: detailLoading,
      error: detailError,
      waifus: detailWaifus,
      activeWaifu: waifuSelection,
      sortKey: waifuSortKey,
      onSelectWaifu: handleWaifuSelect,
      onClose: closeDetails,
    })
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}
