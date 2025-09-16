import Icons from './icons.js';

const { useState } = React;

export function StarRating(props) {
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

export default StarRating;
