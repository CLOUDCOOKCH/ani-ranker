const { createElement } = React;

function createIcon(children) {
  return function Icon(props) {
    return createElement(
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

export const Icons = {
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

export default Icons;
