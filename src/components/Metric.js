export function Metric(props) {
  return React.createElement(
    "span",
    { className: "metric" },
    React.createElement(props.icon, { className: "metric__icon" }),
    React.createElement("span", null, props.label)
  );
}

export default Metric;
