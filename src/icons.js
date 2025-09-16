const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (value != null) {
      element.setAttribute(key, String(value));
    }
  }
  return element;
}

function createSvgBase(props = {}, defaults = {}) {
  const svg = createSvgElement('svg', {
    xmlns: SVG_NS,
    viewBox: '0 0 24 24',
  });

  const baseAttributes = Object.assign(
    {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.6',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    defaults
  );

  for (const [key, value] of Object.entries(baseAttributes)) {
    svg.setAttribute(key, String(value));
  }

  for (const [key, value] of Object.entries(props)) {
    if (value == null) {
      continue;
    }
    const attribute = key === 'className' ? 'class' : key;
    svg.setAttribute(attribute, String(value));
  }

  return svg;
}

function createIconFactory(childrenFactory, options = {}) {
  return function icon(props = {}) {
    const svg = createSvgBase(props, options.defaults);
    const children = childrenFactory();
    for (const child of children) {
      svg.appendChild(child);
    }
    return svg;
  };
}

const Icons = {
  Search: createIconFactory(() => [
    createSvgElement('circle', { cx: '11', cy: '11', r: '6' }),
    createSvgElement('line', { x1: '16.5', y1: '16.5', x2: '21', y2: '21' }),
  ]),
  Sort: createIconFactory(() => [
    createSvgElement('path', { d: 'M6 4v12' }),
    createSvgElement('path', { d: 'M6 16l-2.5-2.5' }),
    createSvgElement('path', { d: 'M6 16l2.5-2.5' }),
    createSvgElement('path', { d: 'M18 20V8' }),
    createSvgElement('path', { d: 'M18 8l-2.5 2.5' }),
    createSvgElement('path', { d: 'M18 8l2.5 2.5' }),
  ]),
  Chevron: createIconFactory(() => [
    createSvgElement('polyline', { points: '8 10 12 14 16 10' }),
  ]),
  Tag: createIconFactory(() => [
    createSvgElement('path', { d: 'M20 12l-8 8-9-9V4h7z' }),
    createSvgElement('circle', { cx: '7.5', cy: '8.5', r: '1.25' }),
  ]),
  Star: createIconFactory(() => [
    createSvgElement('path', { d: 'M12 4l2 4.9 5.2.4-3.9 3.3 1.2 5.1L12 15.7 7.5 17.7l1.2-5.1-4.2-3.3 5.2-.4z' }),
  ]),
  StarSolid: createIconFactory(
    () => [
      createSvgElement('path', {
        d: 'M12 3.4l2.3 5 5.5.4-4.2 3.4 1.3 5.3L12 14.9l-4.9 2.6 1.3-5.3-4.2-3.4 5.5-.4z',
      }),
    ],
    { defaults: { fill: 'currentColor', stroke: 'none' } }
  ),
  Spark: createIconFactory(() => [
    createSvgElement('path', { d: 'M12 4v4' }),
    createSvgElement('path', { d: 'M12 16v4' }),
    createSvgElement('path', { d: 'M4 12h4' }),
    createSvgElement('path', { d: 'M16 12h4' }),
    createSvgElement('path', { d: 'M6.8 6.8l2.6 2.6' }),
    createSvgElement('path', { d: 'M14.6 14.6l2.6 2.6' }),
    createSvgElement('path', { d: 'M17.2 6.8l-2.6 2.6' }),
    createSvgElement('path', { d: 'M9.4 14.6l-2.6 2.6' }),
  ]),
  Flame: createIconFactory(() => [
    createSvgElement('path', { d: 'M12 3.5s4 3.3 4 7.1c0 2.4-1.8 4.4-4 4.4s-4-2-4-4.4c0-3.8 4-7.1 4-7.1z' }),
    createSvgElement('path', { d: 'M12 15c2.2 0 4 1.6 4 3.6 0 1.7-1.7 2.9-4 2.9s-4-1.2-4-2.9c0-2 1.8-3.6 4-3.6z' }),
  ]),
  ArrowRight: createIconFactory(() => [
    createSvgElement('path', { d: 'M5 12h14' }),
    createSvgElement('polyline', { points: '13 6 19 12 13 18' }),
  ]),
  Close: createIconFactory(() => [
    createSvgElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
    createSvgElement('line', { x1: '6', y1: '18', x2: '18', y2: '6' }),
  ]),
  ArrowUpDown: createIconFactory(() => [
    createSvgElement('polyline', { points: '8 7 12 3 16 7' }),
    createSvgElement('polyline', { points: '8 17 12 21 16 17' }),
    createSvgElement('line', { x1: '12', y1: '3', x2: '12', y2: '21' }),
  ]),
};

export { Icons };
export default Icons;
