import {
  fetchCharacterImage,
  fetchGenres,
  fetchStatuses,
  getAnimeById,
  searchAnime,
} from './api/anilist.js';
import { WAIFUS, sortWaifuList, WAIFU_ATTRIBUTE_LABELS } from './data/waifus.js';
import Icons from './icons.js';

const THEME_PRESETS = [
  {
    id: 'naruto',
    label: 'Naruto',
    tagline: 'Leaf Village sunrise',
    swatches: ['#ff9440', '#233d7b', '#ffd37d', '#1c1b2a'],
    palette: {
      '--app-background': 'radial-gradient(circle at 12% 12%, #fff1e0 0%, #ffd7b3 45%, #ffb38a 100%)',
      '--surface': '#fff8ef',
      '--surface-muted': '#ffe2c4',
      '--surface-gradient': 'linear-gradient(160deg, rgba(255, 250, 242, 0.95) 0%, rgba(255, 220, 188, 0.9) 100%)',
      '--accent': '#ff9440',
      '--accent-strong': '#ef6722',
      '--accent-soft': 'rgba(255, 148, 64, 0.22)',
      '--text-main': '#261a17',
      '--text-muted': '#7a5241',
      '--border': '#f2bb8c',
      '--border-strong': '#e98d45',
      '--shadow-soft': '0 25px 60px rgba(251, 124, 32, 0.22)',
      '--shadow-sharp': '0 12px 30px rgba(243, 120, 28, 0.32)',
      '--hero-glow': 'rgba(255, 148, 64, 0.45)',
      '--hero-glow-secondary': 'rgba(255, 196, 133, 0.35)',
      '--focus-ring': 'rgba(255, 148, 64, 0.45)',
    },
  },
  {
    id: 'one-piece',
    label: 'One Piece',
    tagline: 'Treasure fleet skies',
    swatches: ['#47c7ff', '#ffd73d', '#ff6f61', '#072149'],
    palette: {
      '--app-background': 'radial-gradient(circle at 20% 10%, #f0fbff 0%, #c9e9ff 42%, #fff4d6 100%)',
      '--surface': '#ffffff',
      '--surface-muted': '#e7f3ff',
      '--surface-gradient': 'linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(220, 236, 255, 0.9) 100%)',
      '--accent': '#ffd73d',
      '--accent-strong': '#ff8b6a',
      '--accent-soft': 'rgba(71, 199, 255, 0.2)',
      '--text-main': '#072149',
      '--text-muted': '#4f6c8b',
      '--border': '#bad9ff',
      '--border-strong': '#6bb8ff',
      '--shadow-soft': '0 25px 60px rgba(28, 128, 197, 0.18)',
      '--shadow-sharp': '0 14px 32px rgba(71, 199, 255, 0.35)',
      '--hero-glow': 'rgba(71, 199, 255, 0.38)',
      '--hero-glow-secondary': 'rgba(255, 221, 61, 0.35)',
      '--focus-ring': 'rgba(71, 199, 255, 0.45)',
    },
  },
  {
    id: 'dragon-ball',
    label: 'Dragon Ball',
    tagline: 'Super Saiyan charge',
    swatches: ['#ff9a1f', '#3056ff', '#1ed27e', '#1f2233'],
    palette: {
      '--app-background': 'radial-gradient(circle at 10% 90%, #fff4dc 0%, #ffd289 45%, #f0edff 100%)',
      '--surface': '#fff6eb',
      '--surface-muted': '#ffe1bd',
      '--surface-gradient': 'linear-gradient(160deg, rgba(255, 244, 219, 0.95) 0%, rgba(255, 217, 150, 0.9) 100%)',
      '--accent': '#ff9a1f',
      '--accent-strong': '#3056ff',
      '--accent-soft': 'rgba(255, 154, 31, 0.24)',
      '--text-main': '#1f2233',
      '--text-muted': '#57566b',
      '--border': '#f2bf81',
      '--border-strong': '#d98b3a',
      '--shadow-soft': '0 25px 60px rgba(255, 126, 27, 0.22)',
      '--shadow-sharp': '0 14px 32px rgba(48, 86, 255, 0.28)',
      '--hero-glow': 'rgba(255, 154, 31, 0.4)',
      '--hero-glow-secondary': 'rgba(48, 86, 255, 0.3)',
      '--focus-ring': 'rgba(48, 86, 255, 0.45)',
    },
  },
  {
    id: 'bleach',
    label: 'Bleach',
    tagline: 'Soul Society edge',
    swatches: ['#101217', '#f56c3b', '#8fbbe8', '#f7efe6'],
    palette: {
      '--app-background': 'radial-gradient(circle at 85% 15%, #fff7ef 0%, #ffe0d1 40%, #d3e4ff 100%)',
      '--surface': '#fffdf8',
      '--surface-muted': '#f0f2f7',
      '--surface-gradient': 'linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 250, 0.95) 100%)',
      '--accent': '#f56c3b',
      '--accent-strong': '#0f1116',
      '--accent-soft': 'rgba(245, 108, 59, 0.26)',
      '--text-main': '#101217',
      '--text-muted': '#596273',
      '--border': '#d5dcea',
      '--border-strong': '#a9b6cf',
      '--shadow-soft': '0 24px 60px rgba(16, 18, 23, 0.18)',
      '--shadow-sharp': '0 14px 32px rgba(245, 108, 59, 0.28)',
      '--hero-glow': 'rgba(16, 18, 23, 0.45)',
      '--hero-glow-secondary': 'rgba(245, 108, 59, 0.32)',
      '--focus-ring': 'rgba(245, 108, 59, 0.45)',
    },
  },
  {
    id: 'attack-on-titan',
    label: 'Attack on Titan',
    tagline: 'Scout Regiment resolve',
    swatches: ['#2f4636', '#8c6f52', '#d5c5ac', '#5d5f58'],
    palette: {
      '--app-background': 'radial-gradient(circle at 50% 100%, #f4f0e6 0%, #dcd3c2 45%, #c6d9cd 100%)',
      '--surface': '#fdf9f0',
      '--surface-muted': '#ece4d6',
      '--surface-gradient': 'linear-gradient(160deg, rgba(253, 249, 240, 0.95) 0%, rgba(230, 222, 206, 0.9) 100%)',
      '--accent': '#2f4636',
      '--accent-strong': '#8c6f52',
      '--accent-soft': 'rgba(47, 70, 54, 0.22)',
      '--text-main': '#2b2d2a',
      '--text-muted': '#5d5f58',
      '--border': '#c6baa4',
      '--border-strong': '#8c6f52',
      '--shadow-soft': '0 24px 60px rgba(47, 70, 54, 0.18)',
      '--shadow-sharp': '0 14px 32px rgba(140, 111, 82, 0.28)',
      '--hero-glow': 'rgba(47, 70, 54, 0.45)',
      '--hero-glow-secondary': 'rgba(158, 197, 161, 0.35)',
      '--focus-ring': 'rgba(140, 111, 82, 0.45)',
    },
  },
];

const COLLECTION_STATUS_OPTIONS = [
  { value: '', label: 'No status' },
  { value: 'planning', label: 'Planning' },
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On hold' },
  { value: 'dropped', label: 'Dropped' },
];

class AniRankerApp {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.themePresets = THEME_PRESETS.slice();
    const initialTheme = this.themePresets.length > 0 ? this.themePresets[0].id : null;
    this.state = {
      searchTerm: '',
      anime: [],
      isLoading: false,
      error: null,
      genreOptions: [],
      selectedGenres: [],
      statusOptions: [],
      selectedStatuses: [],
      sortBy: 'POPULARITY',
      ratings: {},
      collectionStatuses: {},
      collectionStatusFilter: 'ALL',
      waifuSelection: '',
      waifuSortKey: 'grace',
      waifuSortDirection: 'desc',
      waifuTraitFilters: [],
      waifuHairFilters: [],
      waifuSkinFilters: [],
      waifuChestFilters: [],
      showAllWaifus: false,
      waifuFiltersOpen: false,
      animeFiltersOpen: false,
      selectedWaifuImage: null,
      selectedWaifuImageLoading: false,
      selectedWaifuImageError: null,
      detailId: null,
      detailData: null,
      detailLoading: false,
      detailError: null,
      activeTheme: initialTheme,
    };
    this.themeSwitcherList = null;

    this.waifuTraits = Array.from(new Set(WAIFUS.flatMap((item) => item.traits || []))).sort((a, b) =>
      a.localeCompare(b)
    );
    this.waifuHairColors = Array.from(new Set(WAIFUS.map((item) => item.hairColor))).sort((a, b) =>
      a.localeCompare(b)
    );
    this.waifuSkinTones = Array.from(new Set(WAIFUS.map((item) => item.skinTone))).sort((a, b) =>
      a.localeCompare(b)
    );
    this.waifuChestSizes = Array.from(new Set(WAIFUS.map((item) => item.chest))).sort((a, b) =>
      a.localeCompare(b)
    );

    this.pendingSearch = null;
    this.activeSearchToken = null;
    this.activeDetailToken = null;
    this.waifuImageRequestId = 0;
    this.isMounted = false;

    const savedPreferences = this.loadPreferences();
    if (savedPreferences && typeof savedPreferences === 'object') {
      this.state = Object.assign({}, this.state, savedPreferences);
    }

    this.restoreRatings();
    this.restoreCollectionStatuses();
    this.createLayout();
    this.applyTheme(this.state.activeTheme);
    this.render();
    this.loadGenres();
    this.loadStatuses();
    this.scheduleAnimeSearch();
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    this.handleKeyDown = (event) => {
      if (event.key === 'Escape' && this.state.detailId != null) {
        this.closeDetails();
      }
    };
    document.addEventListener('keydown', this.handleKeyDown);
  }

  restoreRatings() {
    try {
      const stored = window.localStorage.getItem('ani-ranker-ratings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          this.state.ratings = parsed;
        }
      }
    } catch (error) {
      console.warn('Unable to restore saved ratings', error);
    }
  }

  saveRatings(ratings) {
    try {
      window.localStorage.setItem('ani-ranker-ratings', JSON.stringify(ratings));
    } catch (error) {
      console.warn('Failed to persist ratings', error);
    }
  }

  restoreCollectionStatuses() {
    try {
      const stored = window.localStorage.getItem('ani-ranker-collection-statuses');
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return;
      }
      const validStatuses = new Set(
        COLLECTION_STATUS_OPTIONS.filter((option) => option.value).map((option) => option.value)
      );
      const sanitized = {};
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === 'string' && validStatuses.has(value)) {
          sanitized[key] = value;
        }
      });
      this.state.collectionStatuses = sanitized;
    } catch (error) {
      console.warn('Unable to restore saved collection statuses', error);
    }
  }

  saveCollectionStatuses(statuses) {
    try {
      if (!statuses || typeof statuses !== 'object' || Array.isArray(statuses)) {
        window.localStorage.removeItem('ani-ranker-collection-statuses');
        return;
      }
      const validStatuses = new Set(
        COLLECTION_STATUS_OPTIONS.filter((option) => option.value).map((option) => option.value)
      );
      const sanitized = {};
      Object.entries(statuses).forEach(([key, value]) => {
        if (typeof value === 'string' && validStatuses.has(value)) {
          sanitized[key] = value;
        }
      });
      window.localStorage.setItem('ani-ranker-collection-statuses', JSON.stringify(sanitized));
    } catch (error) {
      console.warn('Failed to persist collection statuses', error);
    }
  }


  getDefaultPreferences() {
    return {
      activeTheme:
        this.themePresets && this.themePresets.length > 0 ? this.themePresets[0].id : null,
      searchTerm: '',
      selectedGenres: [],
      selectedStatuses: [],
      waifuSortKey: 'grace',
      waifuSortDirection: 'desc',
      waifuTraitFilters: [],
      waifuHairFilters: [],
      waifuSkinFilters: [],
      waifuChestFilters: [],
      showAllWaifus: false,
    };
  }

  loadPreferences() {
    const defaults = this.getDefaultPreferences();
    try {
      const stored = window.localStorage.getItem('ani-ranker-preferences');
      if (!stored) {
        return defaults;
      }
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') {
        return defaults;
      }
      const ensureStringArray = (value) =>
        Array.isArray(value) ? value.filter((item) => typeof item === 'string') : undefined;
      const sanitized = Object.assign({}, defaults);
      if (
        typeof parsed.activeTheme === 'string' &&
        this.themePresets &&
        this.themePresets.some((item) => item.id === parsed.activeTheme)
      ) {
        sanitized.activeTheme = parsed.activeTheme;
      }
      if (typeof parsed.searchTerm === 'string') {
        sanitized.searchTerm = parsed.searchTerm;
      }
      const genreList = ensureStringArray(parsed.selectedGenres);
      if (genreList) {
        sanitized.selectedGenres = genreList;
      }
      const statusList = ensureStringArray(parsed.selectedStatuses);
      if (statusList) {
        sanitized.selectedStatuses = statusList;
      }
      if (typeof parsed.waifuSortKey === 'string' && parsed.waifuSortKey in WAIFU_ATTRIBUTE_LABELS) {
        sanitized.waifuSortKey = parsed.waifuSortKey;
      }
      if (parsed.waifuSortDirection === 'asc' || parsed.waifuSortDirection === 'desc') {
        sanitized.waifuSortDirection = parsed.waifuSortDirection;
      }
      const traitList = ensureStringArray(parsed.waifuTraitFilters);
      if (traitList) {
        sanitized.waifuTraitFilters = traitList;
      }
      const hairList = ensureStringArray(parsed.waifuHairFilters);
      if (hairList) {
        sanitized.waifuHairFilters = hairList;
      }
      const skinList = ensureStringArray(parsed.waifuSkinFilters);
      if (skinList) {
        sanitized.waifuSkinFilters = skinList;
      }
      const chestList = ensureStringArray(parsed.waifuChestFilters);
      if (chestList) {
        sanitized.waifuChestFilters = chestList;
      }
      if (typeof parsed.showAllWaifus === 'boolean') {
        sanitized.showAllWaifus = parsed.showAllWaifus;
      }
      return sanitized;
    } catch (error) {
      console.warn('Unable to restore preferences', error);
      return defaults;
    }
  }

  savePreferences(preferences) {
    try {
      window.localStorage.setItem('ani-ranker-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to persist preferences', error);
    }
  }

  extractPreferences(state = this.state) {
    const ensureArray = (value) => (Array.isArray(value) ? value.slice() : []);
    const direction = state.waifuSortDirection === 'asc' ? 'asc' : 'desc';
    const defaults = this.getDefaultPreferences();
    const themeIsValid =
      typeof state.activeTheme === 'string' &&
      this.themePresets &&
      this.themePresets.some((item) => item.id === state.activeTheme);
    return {
      activeTheme: themeIsValid
        ? state.activeTheme
        : defaults.activeTheme,
      searchTerm: typeof state.searchTerm === 'string' ? state.searchTerm : '',
      selectedGenres: ensureArray(state.selectedGenres),
      selectedStatuses: ensureArray(state.selectedStatuses),
      waifuSortKey:
        typeof state.waifuSortKey === 'string' && state.waifuSortKey in WAIFU_ATTRIBUTE_LABELS
          ? state.waifuSortKey
          : defaults.waifuSortKey,
      waifuSortDirection: direction,
      waifuTraitFilters: ensureArray(state.waifuTraitFilters),
      waifuHairFilters: ensureArray(state.waifuHairFilters),
      waifuSkinFilters: ensureArray(state.waifuSkinFilters),
      waifuChestFilters: ensureArray(state.waifuChestFilters),
      showAllWaifus: typeof state.showAllWaifus === 'boolean'
        ? state.showAllWaifus
        : defaults.showAllWaifus,
    };
  }

  persistPreferences(state = this.state) {
    this.savePreferences(this.extractPreferences(state));
  }

  updatePreferences(updates) {
    this.setState(updates);
    this.persistPreferences();
  }


  setState(updates) {
    const previousTheme = this.state.activeTheme;
    this.state = Object.assign({}, this.state, updates);
    if (this.state.activeTheme !== previousTheme) {
      this.applyTheme(this.state.activeTheme);
    }
    if (this.isMounted) {
      this.render();
    }
  }

  applyTheme(themeId) {
    if (!this.themePresets || this.themePresets.length === 0) {
      return;
    }
    const preset = this.themePresets.find((item) => item.id === themeId) || this.themePresets[0];
    if (!preset || !preset.palette) {
      return;
    }
    const root = document.documentElement;
    Object.entries(preset.palette).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(key, value);
      }
    });
    if (document.body) {
      document.body.dataset.theme = preset.id;
    }
  }

  handleThemeChange(themeId) {
    if (!themeId || themeId === this.state.activeTheme) {
      return;
    }
    const exists = this.themePresets && this.themePresets.some((item) => item.id === themeId);
    if (!exists) {
      return;
    }
    this.updatePreferences({ activeTheme: themeId });
  }

  scheduleAnimeSearch() {
    if (this.pendingSearch) {
      window.clearTimeout(this.pendingSearch);
    }
    this.pendingSearch = window.setTimeout(() => {
      this.pendingSearch = null;
      this.performAnimeSearch();
    }, 320);
  }

  performAnimeSearch() {
    const query = this.state.searchTerm;
    const genres = this.state.selectedGenres.slice();
    const statuses = this.state.selectedStatuses.slice();
    const token = Symbol('search');
    this.activeSearchToken = token;

    this.setState({ isLoading: true, error: null });

    searchAnime(query, { perPage: 24, genres, statuses })
      .then((results) => {
        if (this.activeSearchToken !== token) {
          return;
        }
        const list = Array.isArray(results) ? results : [];
        this.setState({ anime: list, isLoading: false });
        this.maybeDeriveGenres(list);
      })
      .catch((error) => {
        if (this.activeSearchToken !== token) {
          return;
        }
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to fetch anime';
        this.setState({ error: message, isLoading: false });
      });
  }

  loadGenres() {
    fetchGenres()
      .then((genres) => {
        if (Array.isArray(genres) && genres.length > 0) {
          const list = genres.slice().sort((a, b) => a.localeCompare(b));
          this.setState({ genreOptions: list });
        }
      })
      .catch((error) => {
        console.error('Failed to load genres', error);
      });
  }

  loadStatuses() {
    fetchStatuses()
      .then((statuses) => {
        if (Array.isArray(statuses) && statuses.length > 0) {
          const list = statuses.slice();
          this.setState({ statusOptions: list });
        }
      })
      .catch((error) => {
        console.error('Failed to load statuses', error);
      });
  }

  maybeDeriveGenres(animeList) {
    if (this.state.genreOptions && this.state.genreOptions.length > 0) {
      return;
    }
    const derived = Array.from(
      new Set(
        (animeList || []).flatMap((item) => (Array.isArray(item.genres) ? item.genres : []))
      )
    ).sort((a, b) => a.localeCompare(b));
    if (derived.length > 0) {
      this.setState({ genreOptions: derived });
    }
  }

  createLayout() {
    const app = document.createElement('div');
    app.className = 'app';
    this.rootElement.innerHTML = '';
    this.rootElement.appendChild(app);

    const header = document.createElement('header');
    header.className = 'app__header';
    const badge = document.createElement('span');
    badge.className = 'app__header-badge';
    badge.textContent = 'Big five chakra mode';
    const heading = document.createElement('h1');
    heading.textContent = 'AniRanker';
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Curate a personal anime library and let legendary arcs guide your rankings.';
    const note = document.createElement('p');
    note.className = 'app__header-note';
    note.textContent =
      'Blend AniRanker with iconic palettes from Naruto, One Piece, Dragon Ball, Bleach, and Attack on Titan.';
    header.appendChild(badge);
    header.appendChild(heading);
    header.appendChild(subtitle);
    header.appendChild(note);
    app.appendChild(header);

    this.themeSwitcher = this.createThemeSwitcher();
    app.appendChild(this.themeSwitcher);

    this.waifuSection = this.createWaifuSection();
    app.appendChild(this.waifuSection);

    this.animeFilterToggle = document.createElement('button');
    this.animeFilterToggle.type = 'button';
    this.animeFilterToggle.className = 'section-toggle';
    this.animeFilterToggle.addEventListener('click', () => this.toggleAnimeFilters());
    app.appendChild(this.animeFilterToggle);

    this.filterBar = this.createFilterBar();
    app.appendChild(this.filterBar);

    const main = document.createElement('main');
    this.loadingMessage = document.createElement('p');
    this.loadingMessage.className = 'status-message';
    this.loadingMessage.textContent = 'Loading selections...';
    main.appendChild(this.loadingMessage);

    this.errorMessage = document.createElement('p');
    this.errorMessage.className = 'status-message error';
    main.appendChild(this.errorMessage);

    this.emptyMessage = document.createElement('p');
    this.emptyMessage.className = 'status-message';
    this.emptyMessage.textContent = 'No titles match yet. Try adjusting your filters.';
    main.appendChild(this.emptyMessage);

    this.animeGrid = document.createElement('section');
    this.animeGrid.className = 'anime-grid';
    main.appendChild(this.animeGrid);

    app.appendChild(main);

    this.detailOverlay = this.createDetailOverlay();
    document.body.appendChild(this.detailOverlay);

    this.isMounted = true;
  }

  createThemeSwitcher() {
    const section = document.createElement('section');
    section.className = 'theme-switcher surface-card';

    const header = document.createElement('div');
    header.className = 'theme-switcher__header';
    const title = document.createElement('h2');
    title.className = 'theme-switcher__title';
    title.textContent = 'Big five aura themes';
    const description = document.createElement('p');
    description.className = 'theme-switcher__description';
    description.textContent =
      'Tap into Naruto, One Piece, Dragon Ball, Bleach, and Attack on Titan energy instantly.';
    header.appendChild(title);
    header.appendChild(description);
    section.appendChild(header);

    this.themeSwitcherList = document.createElement('div');
    this.themeSwitcherList.className = 'theme-switcher__list';
    section.appendChild(this.themeSwitcherList);

    return section;
  }

  createWaifuSection() {
    const section = document.createElement('section');
    section.className = 'waifu-selector surface-card';

    const header = document.createElement('div');
    header.className = 'waifu-selector__header';
    const title = document.createElement('h2');
    title.className = 'waifu-selector__title';
    title.textContent = 'Signature muses';
    const subtitle = document.createElement('p');
    subtitle.className = 'waifu-selector__subtitle';
    subtitle.textContent = 'Choose a muse to open her series or tailor the roster to your taste.';
    this.waifuFilterToggle = document.createElement('button');
    this.waifuFilterToggle.type = 'button';
    this.waifuFilterToggle.className = 'section-toggle';
    this.waifuFilterToggle.addEventListener('click', () => this.toggleWaifuFilters());
    header.appendChild(title);
    header.appendChild(subtitle);
    header.appendChild(this.waifuFilterToggle);
    section.appendChild(header);

    this.waifuPreview = document.createElement('div');
    this.waifuPreview.className = 'waifu-selector__preview';
    section.appendChild(this.waifuPreview);

    this.waifuFiltersContainer = document.createElement('div');
    this.waifuFiltersContainer.className = 'waifu-selector__filters';
    section.appendChild(this.waifuFiltersContainer);

    this.waifuEmptyMessage = document.createElement('p');
    this.waifuEmptyMessage.className = 'waifu-selector__empty';
    section.appendChild(this.waifuEmptyMessage);

    this.waifuGallery = document.createElement('div');
    this.waifuGallery.className = 'waifu-selector__gallery';
    section.appendChild(this.waifuGallery);

    this.waifuShowMoreButton = document.createElement('button');
    this.waifuShowMoreButton.type = 'button';
    this.waifuShowMoreButton.className = 'waifu-selector__show-more section-toggle';
    this.waifuShowMoreButton.addEventListener('click', () => this.toggleShowAllWaifus());
    section.appendChild(this.waifuShowMoreButton);

    const note = document.createElement('p');
    note.className = 'waifu-selector__note';
    note.textContent = 'Tap a muse or pick from the list to open her series instantly.';
    section.appendChild(note);

    return section;
  }

  createFilterBar() {
    const section = document.createElement('section');
    section.className = 'filter-bar surface-card';

    const searchField = document.createElement('div');
    searchField.className = 'field';
    const searchLabel = document.createElement('span');
    searchLabel.className = 'field__label';
    searchLabel.textContent = 'Search';
    const searchShell = document.createElement('div');
    searchShell.className = 'input-shell';
    const searchIcon = Icons.Search({ className: 'input-shell__icon', 'aria-hidden': 'true' });
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'search';
    this.searchInput.className = 'input-shell__control';
    this.searchInput.placeholder = 'Search by title or keyword';
    this.searchInput.addEventListener('input', (event) => this.handleSearchChange(event.target.value));
    searchShell.appendChild(searchIcon);
    searchShell.appendChild(this.searchInput);
    searchField.appendChild(searchLabel);
    searchField.appendChild(searchShell);

    const sortField = document.createElement('div');
    sortField.className = 'field';
    const sortLabel = document.createElement('span');
    sortLabel.className = 'field__label';
    sortLabel.textContent = 'Sort';
    const sortShell = document.createElement('div');
    sortShell.className = 'select-shell';
    const sortIcon = Icons.Sort({ className: 'select-shell__icon', 'aria-hidden': 'true' });
    const sortChevron = Icons.Chevron({ className: 'select-shell__chevron', 'aria-hidden': 'true' });
    this.sortSelect = document.createElement('select');
    this.sortSelect.addEventListener('change', (event) => this.handleSortChange(event.target.value));
    const sortOptions = [
      { value: 'POPULARITY', label: 'Popularity' },
      { value: 'AVERAGE_SCORE', label: 'Average score' },
      { value: 'MY_RATING', label: 'My rating' },
    ];
    for (const option of sortOptions) {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      this.sortSelect.appendChild(element);
    }
    sortShell.appendChild(sortIcon);
    sortShell.appendChild(this.sortSelect);
    sortShell.appendChild(sortChevron);
    sortField.appendChild(sortLabel);
    sortField.appendChild(sortShell);

    const genresField = document.createElement('div');
    genresField.className = 'filter-bar__genres field';
    const genresLabel = document.createElement('span');
    genresLabel.className = 'field__label';
    genresLabel.textContent = 'Genres';
    this.genreChipList = document.createElement('div');
    this.genreChipList.className = 'chip-list';
    genresField.appendChild(genresLabel);
    genresField.appendChild(this.genreChipList);

    const statusField = document.createElement('div');
    statusField.className = 'filter-bar__statuses field';
    const statusLabel = document.createElement('span');
    statusLabel.className = 'field__label';
    statusLabel.textContent = 'Status';
    this.statusChipList = document.createElement('div');
    this.statusChipList.className = 'chip-list';
    statusField.appendChild(statusLabel);
    statusField.appendChild(this.statusChipList);

    const collectionField = document.createElement('div');
    collectionField.className = 'filter-bar__collection field';
    const collectionLabel = document.createElement('span');
    collectionLabel.className = 'field__label';
    collectionLabel.textContent = 'My list';
    this.collectionFilterList = document.createElement('div');
    this.collectionFilterList.className = 'chip-list';
    collectionField.appendChild(collectionLabel);
    collectionField.appendChild(this.collectionFilterList);

    section.appendChild(searchField);
    section.appendChild(sortField);
    section.appendChild(genresField);
    section.appendChild(statusField);
    section.appendChild(collectionField);
    return section;
  }

  createDetailOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'detail-overlay';
    overlay.style.display = 'none';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        this.closeDetails();
      }
    });

    this.detailModal = document.createElement('div');
    this.detailModal.className = 'detail-modal';
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'detail-modal__close';
    closeButton.setAttribute('aria-label', 'Close details');
    closeButton.appendChild(Icons.Close({ width: 18, height: 18 }));
    closeButton.addEventListener('click', () => this.closeDetails());
    this.detailModal.appendChild(closeButton);

    this.detailContent = document.createElement('div');
    this.detailModal.appendChild(this.detailContent);
    overlay.appendChild(this.detailModal);

    return overlay;
  }

  renderThemeSwitcher() {
    if (!this.themeSwitcherList) {
      return;
    }
    this.themeSwitcherList.innerHTML = '';
    this.themePresets.forEach((preset) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = preset.id === this.state.activeTheme ? 'theme-chip theme-chip--active' : 'theme-chip';
      button.dataset.theme = preset.id;
      button.setAttribute('aria-pressed', preset.id === this.state.activeTheme ? 'true' : 'false');
      button.setAttribute('aria-label', `Activate ${preset.label} theme`);
      button.addEventListener('click', () => this.handleThemeChange(preset.id));

      const title = document.createElement('span');
      title.className = 'theme-chip__title';
      title.textContent = preset.label;
      const tagline = document.createElement('span');
      tagline.className = 'theme-chip__tagline';
      tagline.textContent = preset.tagline;
      const swatches = document.createElement('span');
      swatches.className = 'theme-chip__swatches';
      (preset.swatches || []).forEach((color) => {
        const swatch = document.createElement('span');
        swatch.className = 'theme-chip__swatch';
        swatch.style.setProperty('--swatch-color', color);
        swatches.appendChild(swatch);
      });

      button.appendChild(title);
      button.appendChild(tagline);
      button.appendChild(swatches);

      if (preset.id === this.state.activeTheme) {
        const status = document.createElement('span');
        status.className = 'theme-chip__status';
        status.textContent = 'Live theme';
        button.appendChild(status);
      }

      this.themeSwitcherList.appendChild(button);
    });
  }

  render() {
    if (!this.isMounted) {
      return;
    }
    this.renderThemeSwitcher();
    this.renderWaifuSection();
    this.renderFilterControls();
    this.renderAnimeSection();
    this.renderDetailModal();
  }

  renderWaifuSection() {
    this.waifuFilterToggle.textContent = this.state.waifuFiltersOpen
      ? 'Hide waifu filters'
      : 'Refine waifu list';

    this.renderWaifuPreview();
    this.renderWaifuFilters();
    this.renderWaifuGallery();
  }

  getFilteredWaifus() {
    let list = WAIFUS.slice();
    if (this.state.waifuTraitFilters.length > 0) {
      list = list.filter((item) =>
        this.state.waifuTraitFilters.every((trait) => item.traits && item.traits.includes(trait))
      );
    }
    if (this.state.waifuHairFilters.length > 0) {
      list = list.filter((item) => this.state.waifuHairFilters.includes(item.hairColor));
    }
    if (this.state.waifuSkinFilters.length > 0) {
      list = list.filter((item) => this.state.waifuSkinFilters.includes(item.skinTone));
    }
    if (this.state.waifuChestFilters.length > 0) {
      list = list.filter((item) => this.state.waifuChestFilters.includes(item.chest));
    }
    return sortWaifuList(list, this.state.waifuSortKey, this.state.waifuSortDirection);
  }

  getVisibleWaifus(filteredList) {
    const filtersActive =
      this.state.waifuTraitFilters.length > 0 ||
      this.state.waifuHairFilters.length > 0 ||
      this.state.waifuSkinFilters.length > 0 ||
      this.state.waifuChestFilters.length > 0;
    if (filtersActive || this.state.showAllWaifus) {
      return filteredList;
    }
    const featured = filteredList.filter((item) => item.featured);
    return featured.length > 0 ? featured : filteredList;
  }

  getSelectedWaifu() {
    if (!this.state.waifuSelection) {
      return null;
    }
    return WAIFUS.find((item) => item.name === this.state.waifuSelection) || null;
  }

  renderWaifuPreview() {
    this.waifuPreview.innerHTML = '';
    const selectedWaifu = this.getSelectedWaifu();
    if (!selectedWaifu) {
      const empty = document.createElement('div');
      empty.className = 'waifu-selector__preview-empty';
      empty.textContent = 'Select a muse to see her spotlight.';
      this.waifuPreview.appendChild(empty);
      return;
    }

    const card = document.createElement('div');
    card.className = 'waifu-selector__preview-card';

    if (this.state.selectedWaifuImageLoading) {
      const loading = document.createElement('p');
      loading.className = 'waifu-selector__status';
      loading.textContent = 'Fetching portrait...';
      card.appendChild(loading);
    } else if (this.state.selectedWaifuImageError) {
      const error = document.createElement('p');
      error.className = 'waifu-selector__status error';
      error.textContent = this.state.selectedWaifuImageError;
      card.appendChild(error);
    } else if (this.state.selectedWaifuImage) {
      const image = document.createElement('img');
      image.src = this.state.selectedWaifuImage;
      image.alt = selectedWaifu.name;
      image.className = 'waifu-selector__preview-image';
      card.appendChild(image);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'waifu-selector__preview-placeholder';
      placeholder.textContent = 'No portrait available';
      card.appendChild(placeholder);
    }

    const content = document.createElement('div');
    content.className = 'waifu-selector__preview-content';
    const name = document.createElement('h3');
    name.textContent = selectedWaifu.name;
    const series = document.createElement('p');
    series.textContent = selectedWaifu.animeTitle;
    const meta = document.createElement('p');
    meta.className = 'waifu-selector__preview-meta';
    meta.textContent = `${selectedWaifu.hairColor} hair · ${selectedWaifu.skinTone} skin · ${selectedWaifu.chest}`;
    const traits = document.createElement('div');
    traits.className = 'waifu-selector__preview-traits';
    selectedWaifu.traits.forEach((trait) => {
      const pill = document.createElement('span');
      pill.textContent = trait;
      traits.appendChild(pill);
    });
    content.appendChild(name);
    content.appendChild(series);
    content.appendChild(meta);
    content.appendChild(traits);
    card.appendChild(content);

    this.waifuPreview.appendChild(card);
  }

  renderWaifuFilters() {
    if (!this.state.waifuFiltersOpen) {
      this.waifuFiltersContainer.innerHTML = '';
      this.waifuFiltersContainer.style.display = 'none';
      return;
    }

    this.waifuFiltersContainer.style.display = 'grid';
    this.waifuFiltersContainer.innerHTML = '';

    const controls = document.createElement('div');
    controls.className = 'waifu-selector__controls';

    const sortField = document.createElement('div');
    sortField.className = 'field';
    const sortLabel = document.createElement('span');
    sortLabel.className = 'field__label';
    sortLabel.textContent = 'Sort muses';
    const sortShell = document.createElement('div');
    sortShell.className = 'select-shell';
    const sortIcon = Icons.Sort({ className: 'select-shell__icon', 'aria-hidden': 'true' });
    const sortSelect = document.createElement('select');
    const sortOptions = [
      { value: 'grace', label: 'Grace' },
      { value: 'intensity', label: 'Intensity' },
      { value: 'warmth', label: 'Warmth' },
      { value: 'mystique', label: 'Mystique' },
      { value: 'name', label: 'Name' },
    ];
    sortOptions.forEach((option) => {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      sortSelect.appendChild(element);
    });
    sortSelect.value = this.state.waifuSortKey;
    sortSelect.addEventListener('change', (event) =>
      this.updatePreferences({ waifuSortKey: event.target.value })
    );
    const sortChevron = Icons.Chevron({ className: 'select-shell__chevron', 'aria-hidden': 'true' });
    sortShell.appendChild(sortIcon);
    sortShell.appendChild(sortSelect);
    sortShell.appendChild(sortChevron);
    sortField.appendChild(sortLabel);
    sortField.appendChild(sortShell);
    controls.appendChild(sortField);

    const direction = document.createElement('div');
    direction.className = 'waifu-selector__direction';
    const directionButton = document.createElement('button');
    directionButton.type = 'button';
    directionButton.appendChild(Icons.ArrowUpDown({ 'aria-hidden': 'true' }));
    directionButton.appendChild(
      document.createTextNode(
        this.state.waifuSortDirection === 'asc' ? 'Ascending' : 'Descending'
      )
    );
    directionButton.addEventListener('click', () => this.toggleWaifuSortDirection());
    direction.appendChild(directionButton);
    controls.appendChild(direction);

    this.waifuFiltersContainer.appendChild(controls);

    const traitSections = [
      {
        label: 'Traits',
        items: this.waifuTraits,
        active: this.state.waifuTraitFilters,
        onToggle: (value) => this.toggleFilterValue('waifuTraitFilters', value),
        onClear: () => this.clearFilterValues('waifuTraitFilters'),
      },
      {
        label: 'Hair',
        items: this.waifuHairColors,
        active: this.state.waifuHairFilters,
        onToggle: (value) => this.toggleFilterValue('waifuHairFilters', value),
        onClear: () => this.clearFilterValues('waifuHairFilters'),
      },
      {
        label: 'Skin',
        items: this.waifuSkinTones,
        active: this.state.waifuSkinFilters,
        onToggle: (value) => this.toggleFilterValue('waifuSkinFilters', value),
        onClear: () => this.clearFilterValues('waifuSkinFilters'),
      },
      {
        label: 'Silhouette',
        items: this.waifuChestSizes,
        active: this.state.waifuChestFilters,
        onToggle: (value) => this.toggleFilterValue('waifuChestFilters', value),
        onClear: () => this.clearFilterValues('waifuChestFilters'),
      },
    ];

    traitSections.forEach((section) => {
      if (!section.items || section.items.length === 0) {
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'waifu-selector__traits';
      const label = document.createElement('span');
      label.className = 'field__label';
      label.textContent = section.label;
      const list = document.createElement('div');
      list.className = 'waifu-selector__trait-list';
      section.items.forEach((item) => {
        const isActive = section.active && section.active.includes(item);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = isActive ? 'trait-chip trait-chip--active' : 'trait-chip';
        button.textContent = item;
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        button.addEventListener('click', () => section.onToggle(item));
        list.appendChild(button);
      });
      if (section.active && section.active.length > 0) {
        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.className = 'trait-chip';
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => section.onClear());
        list.appendChild(clearButton);
      }
      wrapper.appendChild(label);
      wrapper.appendChild(list);
      this.waifuFiltersContainer.appendChild(wrapper);
    });
  }

  renderWaifuGallery() {
    const filtered = this.getFilteredWaifus();
    const visible = this.getVisibleWaifus(filtered);
    const filtersActive =
      this.state.waifuTraitFilters.length > 0 ||
      this.state.waifuHairFilters.length > 0 ||
      this.state.waifuSkinFilters.length > 0 ||
      this.state.waifuChestFilters.length > 0;

    this.waifuGallery.innerHTML = '';
    visible.forEach((waifu) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className =
        'waifu-pill' + (this.state.waifuSelection === waifu.name ? ' waifu-pill--active' : '');
      const strong = document.createElement('strong');
      strong.textContent = waifu.name;
      const title = document.createElement('span');
      title.textContent = waifu.animeTitle;
      const attributeLabel = WAIFU_ATTRIBUTE_LABELS[this.state.waifuSortKey] || 'Score';
      const value = typeof waifu[this.state.waifuSortKey] === 'number' ? waifu[this.state.waifuSortKey] : null;
      const metricText = value != null ? `${attributeLabel} ${value}/10` : waifu.animeTitle;
      const metric = document.createElement('span');
      metric.className = 'waifu-pill__metric';
      metric.textContent = metricText;
      button.appendChild(strong);
      button.appendChild(title);
      button.appendChild(metric);
      button.addEventListener('click', () => this.handleWaifuSelect(waifu.name));
      this.waifuGallery.appendChild(button);
    });

    if (filtered.length > 0 && visible.length === 0) {
      this.waifuEmptyMessage.style.display = 'block';
      this.waifuEmptyMessage.textContent = 'No muse matches the current filters.';
    } else {
      this.waifuEmptyMessage.style.display = 'none';
    }

    if (filtered.length > visible.length && !filtersActive) {
      this.waifuShowMoreButton.style.display = 'inline-flex';
      this.waifuShowMoreButton.textContent = this.state.showAllWaifus
        ? 'Show featured only'
        : 'Show the full roster';
    } else {
      this.waifuShowMoreButton.style.display = 'none';
    }
  }

  renderFilterControls() {
    this.animeFilterToggle.textContent = this.state.animeFiltersOpen
      ? 'Hide search filters'
      : 'Show search filters';

    this.filterBar.style.display = this.state.animeFiltersOpen ? 'grid' : 'none';
    this.searchInput.value = this.state.searchTerm;
    this.sortSelect.value = this.state.sortBy;

    this.genreChipList.innerHTML = '';
    if (this.state.genreOptions.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'chip-list__empty';
      empty.textContent = 'Genres will appear once content loads.';
      this.genreChipList.appendChild(empty);
    } else {
      this.state.genreOptions.forEach((genre) => {
        const isActive = this.state.selectedGenres.includes(genre);
        const label = document.createElement('label');
        label.className = isActive ? 'chip chip--active' : 'chip';
        const icon = Icons.Tag({ className: 'chip__icon', 'aria-hidden': 'true' });
        const text = document.createElement('span');
        text.textContent = genre;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = isActive;
        input.addEventListener('change', () => this.toggleGenre(genre));
        label.appendChild(icon);
        label.appendChild(text);
        label.appendChild(input);
        this.genreChipList.appendChild(label);
      });
    }

    this.statusChipList.innerHTML = '';
    if (this.state.statusOptions.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'chip-list__empty';
      empty.textContent = 'Statuses will appear once content loads.';
      this.statusChipList.appendChild(empty);
    } else {
      this.state.statusOptions.forEach((status) => {
        const isActive = this.state.selectedStatuses.includes(status);
        const label = document.createElement('label');
        label.className = isActive ? 'chip chip--active' : 'chip';
        const icon = Icons.Tag({ className: 'chip__icon', 'aria-hidden': 'true' });
        const text = document.createElement('span');
        text.textContent = status;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = isActive;
        input.addEventListener('change', () => this.toggleStatus(status));
        label.appendChild(icon);
        label.appendChild(text);
        label.appendChild(input);
        this.statusChipList.appendChild(label);
      });
    }

    if (this.collectionFilterList) {
      this.collectionFilterList.innerHTML = '';
      const options = [
        { value: 'ALL', label: 'All' },
        { value: 'UNTRACKED', label: 'Untracked' },
        ...COLLECTION_STATUS_OPTIONS.filter((option) => option.value),
      ];
      options.forEach((option) => {
        const isActive = this.state.collectionStatusFilter === option.value;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = isActive ? 'chip chip--active' : 'chip';
        button.textContent = option.label;
        button.addEventListener('click', () => this.setCollectionStatusFilter(option.value));
        this.collectionFilterList.appendChild(button);
      });
    }
  }

  renderAnimeSection() {
    const sortedAnime = this.getSortedAnime();
    this.loadingMessage.style.display = this.state.isLoading ? 'block' : 'none';
    this.errorMessage.style.display = this.state.error ? 'block' : 'none';
    this.errorMessage.textContent = this.state.error || '';
    const showEmpty = !this.state.isLoading && !this.state.error && sortedAnime.length === 0;
    this.emptyMessage.style.display = showEmpty ? 'block' : 'none';

    this.animeGrid.innerHTML = '';
    sortedAnime.forEach((anime) => {
      this.animeGrid.appendChild(this.createAnimeCard(anime));
    });
  }

  getSortedAnime() {
    const list = Array.isArray(this.state.anime) ? this.state.anime.slice() : [];
    const filter = this.state.collectionStatusFilter;
    let filtered = list;
    if (filter === 'UNTRACKED') {
      filtered = list.filter((item) => {
        if (!item || !item.id) {
          return true;
        }
        return !this.state.collectionStatuses || this.state.collectionStatuses[item.id] == null;
      });
    } else if (filter && filter !== 'ALL') {
      filtered = list.filter((item) => {
        if (!item || !item.id) {
          return false;
        }
        return (
          this.state.collectionStatuses && this.state.collectionStatuses[item.id] === filter
        );
      });
    }
    const fallbackSort = (a, b) => {
      const left = a && a.popularity != null ? a.popularity : 0;
      const right = b && b.popularity != null ? b.popularity : 0;
      return right - left;
    };

    if (this.state.sortBy === 'AVERAGE_SCORE') {
      return filtered.sort((first, second) => {
        const left = first && first.averageScore != null ? first.averageScore : 0;
        const right = second && second.averageScore != null ? second.averageScore : 0;
        if (right === left) {
          return fallbackSort(first, second);
        }
        return right - left;
      });
    }

    if (this.state.sortBy === 'MY_RATING') {
      return filtered.sort((first, second) => {
        const left = this.state.ratings && this.state.ratings[first.id] != null ? this.state.ratings[first.id] : -1;
        const right = this.state.ratings && this.state.ratings[second.id] != null ? this.state.ratings[second.id] : -1;
        if (right === left) {
          return fallbackSort(first, second);
        }
        return right - left;
      });
    }

    return filtered.sort(fallbackSort);
  }

  createAnimeCard(anime) {
    const card = document.createElement('article');
    card.className = 'anime-card';

    const coverButton = document.createElement('button');
    coverButton.type = 'button';
    coverButton.className = 'anime-card__cover';
    coverButton.addEventListener('click', () => this.openDetails(anime.id));
    if (anime.coverImage && anime.coverImage.large) {
      const img = document.createElement('img');
      img.src = anime.coverImage.large;
      img.alt = this.getAnimeTitle(anime);
      img.loading = 'lazy';
      coverButton.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'anime-card__placeholder';
      placeholder.textContent = 'Cover unavailable';
      coverButton.appendChild(placeholder);
    }
    card.appendChild(coverButton);

    const content = document.createElement('div');
    content.className = 'anime-card__content';

    const title = document.createElement('h3');
    title.className = 'anime-card__title';
    const displayTitle = this.getAnimeTitle(anime);
    title.textContent = displayTitle;
    title.title = displayTitle;

    const metrics = document.createElement('div');
    metrics.className = 'anime-card__metrics';
    metrics.appendChild(
      createMetric(Icons.Star, `Score ${anime.averageScore != null ? anime.averageScore : '—'}`)
    );
    metrics.appendChild(
      createMetric(
        Icons.Flame,
        `Popularity ${anime.popularity != null ? anime.popularity : '—'}`
      )
    );

    const actions = document.createElement('div');
    actions.className = 'anime-card__actions';

    const collectionControl = document.createElement('div');
    collectionControl.className = 'collection-control';
    const collectionLabel = document.createElement('span');
    collectionLabel.className = 'collection-control__label';
    collectionLabel.appendChild(Icons.Tag({ className: 'collection-control__icon', 'aria-hidden': 'true' }));
    collectionLabel.appendChild(document.createTextNode('My list'));
    const collectionShell = document.createElement('div');
    collectionShell.className = 'select-shell collection-control__select';
    const collectionIcon = Icons.Tag({ className: 'select-shell__icon', 'aria-hidden': 'true' });
    const collectionChevron = Icons.Chevron({ className: 'select-shell__chevron', 'aria-hidden': 'true' });
    const collectionSelect = document.createElement('select');
    const savedStatus =
      this.state.collectionStatuses && this.state.collectionStatuses[anime.id]
        ? this.state.collectionStatuses[anime.id]
        : '';
    COLLECTION_STATUS_OPTIONS.forEach((option) => {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      collectionSelect.appendChild(element);
    });
    collectionSelect.value = savedStatus;
    collectionSelect.addEventListener('change', (event) => {
      const value = event.target.value;
      this.handleCollectionStatusChange(anime.id, value ? value : null);
    });
    collectionShell.appendChild(collectionIcon);
    collectionShell.appendChild(collectionSelect);
    collectionShell.appendChild(collectionChevron);
    collectionControl.appendChild(collectionLabel);
    collectionControl.appendChild(collectionShell);

    const ratingControl = document.createElement('div');
    ratingControl.className = 'rating-control';
    const ratingLabel = document.createElement('span');
    ratingLabel.className = 'rating-control__label';
    ratingLabel.appendChild(Icons.Spark({ className: 'metric__icon', 'aria-hidden': 'true' }));
    ratingLabel.appendChild(document.createTextNode('My Rating'));
    const starRating = createStarRating(
      this.state.ratings[anime.id] != null ? this.state.ratings[anime.id] : null,
      (rating) => this.handleRatingChange(anime.id, rating)
    );
    ratingControl.appendChild(ratingLabel);
    ratingControl.appendChild(starRating);

    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.className = 'button button--primary';
    detailsButton.appendChild(document.createTextNode('View details'));
    detailsButton.appendChild(Icons.ArrowRight({ className: 'button__icon', 'aria-hidden': 'true' }));
    detailsButton.addEventListener('click', () => this.openDetails(anime.id));

    actions.appendChild(collectionControl);
    actions.appendChild(ratingControl);
    actions.appendChild(detailsButton);

    content.appendChild(title);
    content.appendChild(metrics);
    content.appendChild(actions);

    card.appendChild(content);
    return card;
  }

  renderDetailModal() {
    if (this.state.detailId == null) {
      this.detailOverlay.style.display = 'none';
      return;
    }

    this.detailOverlay.style.display = 'grid';
    this.detailContent.innerHTML = '';

    if (this.state.detailLoading) {
      const loading = document.createElement('p');
      loading.className = 'status-message';
      loading.textContent = 'Gathering details...';
      this.detailContent.appendChild(loading);
    }

    if (this.state.detailError) {
      const error = document.createElement('p');
      error.className = 'status-message error';
      error.textContent = this.state.detailError;
      this.detailContent.appendChild(error);
    }

    const data = this.state.detailData;
    if (data) {
      const header = document.createElement('header');
      header.className = 'detail-modal__header';
      if (data.coverImage && data.coverImage.large) {
        const cover = document.createElement('div');
        cover.className = 'detail-modal__cover';
        const image = document.createElement('img');
        const title = this.getAnimeTitle(data);
        image.src = data.coverImage.large;
        image.alt = title || 'Anime cover';
        cover.appendChild(image);
        header.appendChild(cover);
      }

      const info = document.createElement('div');
      const title = document.createElement('h2');
      title.className = 'detail-modal__title';
      title.textContent = this.getAnimeTitle(data);
      info.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'detail-modal__meta';
      meta.appendChild(
        createMetric(
          Icons.Star,
          `Average ${data.averageScore != null ? data.averageScore : '—'}`
        )
      );
      meta.appendChild(
        createMetric(
          Icons.Flame,
          `Popularity ${data.popularity != null ? data.popularity : '—'}`
        )
      );
      if (data.episodes != null) {
        meta.appendChild(createMetric(Icons.Spark, `Episodes ${data.episodes}`));
      }
      if (data.status) {
        meta.appendChild(createMetric(Icons.Tag, data.status));
      }
      if (data.duration != null) {
        meta.appendChild(createMetric(Icons.Tag, `${data.duration} min`));
      }
      if (data.seasonYear) {
        meta.appendChild(createMetric(Icons.Tag, `${data.seasonYear}`));
      }
      const detailId = data && data.id != null ? data.id : this.state.detailId;
      const collectionStatusValue =
        this.state.collectionStatuses && detailId != null
          ? this.state.collectionStatuses[detailId]
          : null;
      const collectionStatusLabel = this.getCollectionStatusLabel(collectionStatusValue);
      const collectionStatusText = collectionStatusLabel
        ? `My list ${collectionStatusLabel}`
        : 'My list Untracked';
      meta.appendChild(createMetric(Icons.Spark, collectionStatusText));
      info.appendChild(meta);

      if (Array.isArray(data.genres) && data.genres.length > 0) {
        const genres = document.createElement('p');
        genres.className = 'detail-modal__genres';
        genres.textContent = data.genres.join(' · ');
        info.appendChild(genres);
      }

      header.appendChild(info);
      this.detailContent.appendChild(header);

      if (data.description) {
        const description = document.createElement('p');
        description.className = 'detail-modal__description';
        description.textContent = data.description;
        this.detailContent.appendChild(description);
      }

      const detailWaifus = this.state.detailId
        ? sortWaifuList(
            WAIFUS.filter((item) => item.animeId === this.state.detailId),
            this.state.waifuSortKey,
            this.state.waifuSortDirection
          )
        : [];
      if (detailWaifus.length > 0) {
        const waifuSection = document.createElement('div');
        waifuSection.className = 'detail-modal__waifus';
        const label = document.createElement('h3');
        label.className = 'field__label';
        label.textContent = 'Beloved waifus';
        const list = document.createElement('div');
        list.className = 'detail-modal__waifu-list';
        const attributeKey = this.state.waifuSortKey;
        const attributeLabel = WAIFU_ATTRIBUTE_LABELS[attributeKey] || 'Score';
        detailWaifus.forEach((waifu) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className =
            'waifu-pill' + (this.state.waifuSelection === waifu.name ? ' waifu-pill--active' : '');
          const name = document.createElement('strong');
          name.textContent = waifu.name;
          const animeTitle = document.createElement('span');
          animeTitle.textContent = waifu.animeTitle;
          const value = typeof waifu[attributeKey] === 'number' ? waifu[attributeKey] : null;
          const metricText = value != null ? `${attributeLabel} ${value}/10` : waifu.animeTitle;
          const metric = document.createElement('span');
          metric.className = 'waifu-pill__metric';
          metric.textContent = metricText;
          button.appendChild(name);
          button.appendChild(animeTitle);
          button.appendChild(metric);
          button.addEventListener('click', () => this.handleWaifuSelect(waifu.name));
          list.appendChild(button);
        });
        waifuSection.appendChild(label);
        waifuSection.appendChild(list);
        this.detailContent.appendChild(waifuSection);
      }
    }
  }

  getAnimeTitle(anime) {
    if (!anime || !anime.title) {
      return 'Untitled';
    }
    return anime.title.english || anime.title.romaji || 'Untitled';
  }

  getCollectionStatusLabel(value) {
    if (!value) {
      return null;
    }
    const option = COLLECTION_STATUS_OPTIONS.find((item) => item.value === value);
    return option ? option.label : value;
  }

  toggleFilterValue(key, value) {
    const current = this.state[key] || [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : current.concat(value);
    const updates = {};
    updates[key] = next;
    this.updatePreferences(updates);
  }

  clearFilterValues(key) {
    const updates = {};
    updates[key] = [];
    this.updatePreferences(updates);
  }

  toggleWaifuSortDirection() {
    this.updatePreferences({
      waifuSortDirection: this.state.waifuSortDirection === 'asc' ? 'desc' : 'asc',
    });
  }

  toggleShowAllWaifus() {
    this.updatePreferences({ showAllWaifus: !this.state.showAllWaifus });
  }

  toggleWaifuFilters() {
    this.setState({ waifuFiltersOpen: !this.state.waifuFiltersOpen });
  }

  toggleAnimeFilters() {
    this.setState({ animeFiltersOpen: !this.state.animeFiltersOpen });
  }

  setCollectionStatusFilter(value) {
    const next = this.state.collectionStatusFilter === value ? 'ALL' : value;
    this.setState({ collectionStatusFilter: next });
  }

  handleSearchChange(value) {
    this.updatePreferences({ searchTerm: value });
    this.scheduleAnimeSearch();
  }

  handleSortChange(value) {
    this.setState({ sortBy: value });
  }

  toggleGenre(genre) {
    const current = this.state.selectedGenres;
    const next = current.includes(genre)
      ? current.filter((item) => item !== genre)
      : current.concat(genre);
    this.updatePreferences({ selectedGenres: next });
    this.scheduleAnimeSearch();
  }

  toggleStatus(status) {
    const current = this.state.selectedStatuses;
    const next = current.includes(status)
      ? current.filter((item) => item !== status)
      : current.concat(status);
    this.updatePreferences({ selectedStatuses: next });
    this.scheduleAnimeSearch();
  }

  handleRatingChange(id, rating) {
    const next = Object.assign({}, this.state.ratings);
    if (rating == null) {
      delete next[id];
    } else {
      next[id] = rating;
    }
    this.setState({ ratings: next });
    this.saveRatings(next);
  }

  handleCollectionStatusChange(id, status) {
    const next = Object.assign({}, this.state.collectionStatuses);
    if (!status) {
      delete next[id];
    } else {
      next[id] = status;
    }
    this.setState({ collectionStatuses: next });
    this.saveCollectionStatuses(next);
  }

  handleWaifuSelect(name) {
    const value = typeof name === 'string' ? name : '';
    const previousSearch = this.state.searchTerm;
    const updates = {
      waifuSelection: value,
    };

    if (!value) {
      this.waifuImageRequestId = 0;
      updates.selectedWaifuImage = null;
      updates.selectedWaifuImageLoading = false;
      updates.selectedWaifuImageError = null;
      this.setState(updates);
      return;
    }

    const requestId = Date.now();
    this.waifuImageRequestId = requestId;
    updates.selectedWaifuImage = null;
    updates.selectedWaifuImageLoading = true;
    updates.selectedWaifuImageError = null;
    this.setState(updates);

    fetchCharacterImage(value)
      .then((image) => {
        if (this.waifuImageRequestId !== requestId) {
          return;
        }
        this.setState({ selectedWaifuImage: image, selectedWaifuImageLoading: false });
      })
      .catch((error) => {
        if (this.waifuImageRequestId !== requestId) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Unable to fetch portrait';
        this.setState({
          selectedWaifuImage: null,
          selectedWaifuImageError: message,
          selectedWaifuImageLoading: false,
        });
      });

    const entry = WAIFUS.find((item) => item.name === value);
    if (entry) {
      if (entry.animeTitle && entry.animeTitle !== previousSearch) {
        this.updatePreferences({ searchTerm: entry.animeTitle });
        this.scheduleAnimeSearch();
      }
      if (entry.animeId !== this.state.detailId) {
        this.openDetails(entry.animeId);
      }
    }
  }

  openDetails(id) {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const token = Symbol('detail');
    this.activeDetailToken = token;
    this.setState({
      detailId: numericId,
      detailData: null,
      detailError: null,
      detailLoading: true,
    });
    this.ensureWaifuSelectionForDetail(numericId);

    getAnimeById(numericId)
      .then((data) => {
        if (this.activeDetailToken !== token) {
          return;
        }
        this.setState({ detailData: data, detailLoading: false });
      })
      .catch((error) => {
        if (this.activeDetailToken !== token) {
          return;
        }
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to load details';
        this.setState({ detailError: message, detailLoading: false });
      });
  }

  ensureWaifuSelectionForDetail(id) {
    const matches = WAIFUS.filter((item) => item.animeId === id);
    if (matches.length === 0) {
      return;
    }
    const alreadySelected = matches.some((item) => item.name === this.state.waifuSelection);
    if (!alreadySelected) {
      this.setState({
        waifuSelection: matches[0].name,
        selectedWaifuImage: null,
        selectedWaifuImageError: null,
        selectedWaifuImageLoading: false,
      });
    }
  }

  closeDetails() {
    this.setState({
      detailId: null,
      detailData: null,
      detailError: null,
      detailLoading: false,
    });
  }
}

function createMetric(iconFactory, label) {
  const wrapper = document.createElement('span');
  wrapper.className = 'metric';
  const icon = iconFactory({ className: 'metric__icon', 'aria-hidden': 'true' });
  const text = document.createElement('span');
  text.textContent = label;
  wrapper.appendChild(icon);
  wrapper.appendChild(text);
  return wrapper;
}

function createStarRating(value, onChange) {
  const container = document.createElement('div');
  container.className = 'star-rating';
  const group = document.createElement('div');
  group.className = 'star-rating__stars';
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', 'My rating');
  const label = document.createElement('span');
  label.className = 'rating-control__value';
  label.textContent = value != null ? `${value}/10` : 'Tap a star to rate';
  container.appendChild(group);
  container.appendChild(label);

  const buttons = [];
  let hovered = null;

  const refreshVisuals = () => {
    buttons.forEach((button, index) => {
      const score = index + 1;
      const active = value != null && score <= value;
      const hoverActive = hovered != null && score <= hovered;
      button.dataset.active = active ? 'true' : 'false';
      button.dataset.hover = hoverActive ? 'true' : 'false';
      button.setAttribute('aria-pressed', value === score ? 'true' : 'false');
      const desired = hoverActive || active ? Icons.StarSolid : Icons.Star;
      const currentIcon = button.querySelector('svg');
      const nextIcon = desired({ className: 'star-icon', 'aria-hidden': 'true' });
      if (currentIcon) {
        button.replaceChild(nextIcon, currentIcon);
      } else {
        button.appendChild(nextIcon);
      }
    });
    label.textContent = value != null ? `${value}/10` : 'Tap a star to rate';
  };

  for (let index = 0; index < 10; index += 1) {
    const score = index + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'star-button';
    button.dataset.active = value != null && score <= value ? 'true' : 'false';
    button.dataset.hover = 'false';
    button.setAttribute('aria-label', `Rate ${score} ${score === 1 ? 'star' : 'stars'}`);
    button.setAttribute('aria-pressed', value === score ? 'true' : 'false');
    button.addEventListener('click', () => {
      const next = value === score ? null : score;
      if (typeof onChange === 'function') {
        onChange(next);
      }
    });
    button.addEventListener('mouseenter', () => {
      hovered = score;
      refreshVisuals();
    });
    button.addEventListener('mouseleave', () => {
      hovered = null;
      refreshVisuals();
    });
    button.addEventListener('focus', () => {
      hovered = score;
      refreshVisuals();
    });
    button.addEventListener('blur', () => {
      hovered = null;
      refreshVisuals();
    });
    group.appendChild(button);
    buttons.push(button);
  }

  refreshVisuals();
  return container;
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    new AniRankerApp(root);
  }
});
