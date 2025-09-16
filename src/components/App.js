import { fetchCharacterImage, fetchGenres, getAnimeById, searchAnime } from '../api/anilist.js';
import { WAIFUS, sortWaifuList } from '../data/waifus.js';
import AnimeCard from './AnimeCard.js';
import DetailModal from './DetailModal.js';
import FilterBar from './FilterBar.js';
import WaifuSelector from './WaifuSelector.js';

const { useState, useEffect, useMemo, useRef } = React;
export function App() {
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

export default App;
