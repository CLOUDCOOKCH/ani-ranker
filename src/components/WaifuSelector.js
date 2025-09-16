import { WAIFU_ATTRIBUTE_LABELS } from '../data/waifus.js';
import Icons from './icons.js';

export function WaifuSelector(props) {
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

export default WaifuSelector;
