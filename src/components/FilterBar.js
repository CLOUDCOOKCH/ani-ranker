import Icons from './icons.js';

export function FilterBar(props) {
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

export default FilterBar;
