import {
  essentialColorStops,
  layerTitleMap,
  legendDescriptionMap,
  mismatchColorStops,
  priorityScoreColorStops,
  transitColorEnds,
  vulnerableColorEnds,
} from './consts';

let LEGEND_WIDTH = document.getElementById('legend-container').offsetWidth - 20;
if (LEGEND_WIDTH < 400) LEGEND_WIDTH -= 20;

const buildLegend = (colors, type, scaleLabels, description, title) => {
  let legend = `
  <h2 class="legend-title">${title}</h2>
  <div class="map-legend-wrapper">
  <span class="map-legend-scale-labels">${scaleLabels[0]}</span>
  <div class="map-legend"
  `;

  const blockWidth = LEGEND_WIDTH / colors.length;

  if (type === 'step') {
    legend += '>';
    colors.forEach((color) => {
      legend += `<span class='map-legend-step' style="background:${color}; width:${blockWidth}px;"></span>`;
    });
  }

  if (type === 'interpolate') {
    legend += ` style="background: linear-gradient(to right, ${colors[0]}, ${colors[1]});">`;
  }

  legend += `</div><span class="map-legend-scale-labels">${scaleLabels[1]}</span></div>`;
  legend += `<span class='legend-description'>${description}</span>`;
  return legend;
};

const buildPriorityScoreLegend = () => {
  // const colors = [];
  // colors.push('#545454');

  let legend = `
    <h2 class="legend-title">Priority Score</h2>
    <div class="map-legend-wrapper">
    <span class="map-legend-scale-labels">-90</span>
    <div class="map-legend">
  `;

  for (const [color, range] of Object.entries(priorityScoreColorStops)) {
    const blockWidth = (range / 180) * LEGEND_WIDTH;
    legend += `<span class='map-legend-step' style="background:${color}; width:${blockWidth}px;"></span>`;
  }

  legend += '</div><span class="map-legend-scale-labels">90</span></div>';
  legend += `<span class='legend-description'>${legendDescriptionMap['priority']}</span>`;

  return legend;
};

const handleLegend = (layer) => {
  let legend = '';

  switch (layer) {
    case 'vulnerable':
      legend = buildLegend(
        vulnerableColorEnds,
        'interpolate',
        [1, 10],
        legendDescriptionMap[layer],
        layerTitleMap[layer],
      );
      break;
    case 'essential':
      legend = buildLegend(essentialColorStops, 'step', [1, 10], legendDescriptionMap[layer], layerTitleMap[layer]);
      break;
    case 'mismatch':
      legend = buildLegend(mismatchColorStops, 'step', [-9, 9], legendDescriptionMap[layer], layerTitleMap[layer]);
      break;
    case 'transit':
      legend = buildLegend(transitColorEnds, 'interpolate', [1, 10], legendDescriptionMap[layer], layerTitleMap[layer]);
      break;
    case 'priority':
      legend = buildPriorityScoreLegend();
      break;
  }

  return legend;
};

export { handleLegend };
