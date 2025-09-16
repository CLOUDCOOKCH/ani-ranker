import Icons from './icons.js';
import Metric from './Metric.js';
import StarRating from './StarRating.js';

export function AnimeCard(props) {
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

export default AnimeCard;
