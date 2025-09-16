import Icons from './icons.js';
import Metric from './Metric.js';
import { WAIFU_ATTRIBUTE_LABELS } from '../data/waifus.js';

export function DetailModal(props) {
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

export default DetailModal;
