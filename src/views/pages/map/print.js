import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'svg2pdf.js';
import { countyLookup } from './consts';
import { numberWithCommas } from './utils';
import dvrpcLogo from '../../../assets/images/dvrpc_full_log_small.png';
import { height } from '@fortawesome/free-regular-svg-icons/faAddressBook';

const bgTable = {
  Population: 'pop',
  Households: 'hh',
  Jobs: 'sum_jobs',
};

const vpTable = {
  'Households with 1 or More People with Disability': 'hh_dis',
  'Number of Households Below Poverty Line': 'hh_pov',
  'People 65 or Older': 'pop65',
  'Vulnerable Population Rank': 'vul_pop_rank',
};

const esTable = {
  'Activity Centers for Seniors or Disabled': 'ss_cnt',
  'Food Stores': 'food_cnt',
  'Health Care Facilities': 'hc_cnt',
  'Number of Educational Institutions': 'school_cnt',
  'Parks/Outdoor Spaces Present': 'os_check',
  Trails: 'trail_cnt',
  'Essential Services Total': 'es_sum',
  Jobs: 'sum_jobs',
  'Essential Services Rank': 'es_rank',
};

const psmTable = {
  'Vulnerable Population Rank': 'vul_pop_rank',
  'Essential Services Rank': 'es_rank',
  'Access Gap': 'access_gap_rank',
};

const taTable = {
  'Parks and Outdoor Spaces': 't_45_es_job_avg',
  Jobs: 't_jobs_cnt',
  'Transit Accessibility Rank': 'transit_access_rank',
};

const psTable = {
  'Priority Score': 'eta_score',
};

const getTable = (table, data, startY) => {
  var head = [['', '']];
  var body = Object.entries(table).map((row) => {
    return [row[0], numberWithCommas(Math.round(data[row[1]]))];
  });
  return { head, body, startY: startY };
};

const vulnerbaleLegend = `
    <h2 class="legend-title">Vulnerable Populations</h2>
    <div class="map-legend-wrapper">
    <span class="map-legend-scale-labels">1</span>
    <div class="map-legend">
      <span class="map-legend-step" style="background:#dbdbeb; width:42px;"></span>
      <span class="map-legend-step" style="background:#c5c4e1; width:42px;"></span>
      <span class="map-legend-step" style="background:#b1add7; width:42px;"></span>
      <span class="map-legend-step" style="background:#9e96cd; width:42px;"></span>
      <span class="map-legend-step" style="background:#8d80c2; width:42px;"></span>
      <span class="map-legend-step" style="background:#7c69b6; width:42px;"></span>
      <span class="map-legend-step" style="background:#6c53a9; width:42px;"></span>
      <span class="map-legend-step" style="background:#5d3c9c; width:42px;"></span>
      <span class="map-legend-step" style="background:#4e238e; width:42px;"></span>
      <span class="map-legend-step" style="background:#400080; width:42px;"></span>
    </div>
    <span class="map-legend-scale-labels">10</span>
    </div>
    <span class="legend-description">
      Lower values were assigned to areas with fewer vulnerable populations and higher values were assigned to areas with more 
      vulnerable populations.
    </span>
  `;

const transitLegend = `
  <h2 class="legend-title">Transit Accessibility</h2>
  <div class="map-legend-wrapper">
  <span class="map-legend-scale-labels">1</span>
  <div class="map-legend">
    <span class="map-legend-step" style="background:#faf261; width:42px;"></span>
    <span class="map-legend-step" style="background:#d9f06b; width:42px;"></span>
    <span class="map-legend-step" style="background:#baec79; width:42px;"></span>
    <span class="map-legend-step" style="background:#a0e687; width:42px;"></span>
    <span class="map-legend-step" style="background:#8ade95; width:42px;"></span>
    <span class="map-legend-step" style="background:#79d6a1; width:42px;"></span>
    <span class="map-legend-step" style="background:#70ccaa; width:42px;"></span>
    <span class="map-legend-step" style="background:#6dc1af; width:42px;"></span>
    <span class="map-legend-step" style="background:#70b6b0; width:42px;"></span>
    <span class="map-legend-step" style="background:#76abad; width:42px;"></span>
  </div>
  <span class="map-legend-scale-labels">10</span>
  </div>
  <span class="legend-description">
    Lower values were assigned to areas that are more accessible by transit and higher values were assigned to areas that are fewer accessible by transit.
  </span>
`;

const contextLegendMap = {
  'es-senior': `<svg width="3" height="3" viewBox="0 0 3 3">
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#FDAA02" />
                </svg>`,
  'es-food': `<svg width="3" height="3">
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#AAFE00" />
                </svg>`,
  'es-health': `<svg width="3" height="3">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#eb548c" />
              </svg>`,
  'es-school': `<svg width="3" height="3">
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#00A9E5" />
                </svg>`,
  'trail-lines': `<svg width="3" height="3">
                    <line x1="0" x2="3" y1="1.5" y2="1.5" stroke="#8AAB52" />
                  </svg>`,
  'open-space-fill': `<svg width="3" height="3">
                        <rect x="0" y="0" width="3" height="3" fill="#B6CC89" />
                      </svg>`,
  bus: `<svg width="24" height="12">
            <line x1="0" x2="24" y1="6" y2="6" stroke="#66b2b2" />
            <circle cx="12" cy="1.5" r="1.5" fill="#66b2b2" />
          </svg>`,
  rail: `<svg width="24" height="12">
              <line x1="0" x2="24" y1="6" y2="6" stroke="#C203FA" />
              <line x1="0" x2="24" y1="6" y2="6" stroke="#C203FA" />
              <line x1="0" x2="24" y1="6" y2="6" stroke="#C203FA" />
              <circle cx="12" cy="1.5" r="1.5" fill="#FF73DF" />
            </svg>`,
  ped: `<svg width="24" height="12">
            <circle cx="2" cy="1.5" r="2" fill="#AC7E4B" />
            <line x1="0" x2="24" y1="6" y2="6" stroke="#DABC94" />
            <circle cx="22" cy="1.5" r="2" fill="#AC7E4B" />
          </svg>`,
};

// function buildContextLegend(doc) {
//   // const checkedBoxes = [...document.querySelectorAll('.es-checkbox:checked')].map((e) => e.value);
//   const checkedBoxes = [...document.querySelectorAll('input[type=checkbox]:checked')].map((e) => e.value);
//   let legend =
//     "<div style='font-size:11px; border:1px solid; background-color: rgb(239 240 240); padding: 05px 15px; width: 460px'>";

//   let startY = 240;
//   checkedBoxes.forEach(async (value) => {
//     const element = document.getElementById(value);

//     doc.svg(element, {
//       x: 355,
//       y: startY,
//       width: 12,
//       height: 12,
//     });
//     startY += 14;
//   });
//   return legend + '</div>';
// }

const handlePrint = async (selectedLayer) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  var pageWidth = doc.internal.pageSize.getWidth();

  const mapCanvas = document.querySelector('.mapboxgl-canvas');
  const src = mapCanvas.toDataURL('image/png');
  const mapWidth = mapCanvas.width;
  const mapHeight = mapCanvas.height;
  // const items = [JSON.parse(selectedAttributes)];

  const imageWidth = Math.round(pageWidth * 0.9);
  const imageHeight = Math.round(mapHeight * (imageWidth / mapWidth));

  const selectedAttributes = localStorage.getItem('state_selectedAttributes');
  const data = JSON.parse(selectedAttributes);
  const currentDate = new Date().toLocaleString();

  doc.setFontSize(18);
  doc.text('Equity Through Access Report', pageWidth / 2, 40, {
    align: 'center',
  });
  doc.addImage(dvrpcLogo, 'PNG', 20, 20, 90, 36);
  doc.setFontSize(7);
  doc.text(currentDate, 35, 65);
  doc.setFontSize(14);

  doc.text('Block Group ID: ' + data.geoid, pageWidth / 2, 58, 'center');
  doc.text(`${data.mun1}, ${countyLookup[data.geoid.substring(0, 5)]}`, pageWidth / 2, 75, 'center');

  selectedLayer;
  let legend = document.getElementById('legend-container').innerHTML;
  if (selectedLayer === 'vulnerable') legend = vulnerbaleLegend;
  if (selectedLayer === 'transit') legend = transitLegend;

  let legendWrapper =
    "<div style='font-size:11px; border:1px solid; background-color: rgb(239 240 240); padding: 05px 15px; width: 460px'>" +
    legend +
    '</div>';

  doc.setFontSize(12);
  doc.text(
    `The Equity Through Access project of the Delaware Valley Regional Planning Commission (DVRPC) is an update to the region's Coordinated Human Services Transportation Plan (CHSTP). The ETA project engaged a variety of stakeholders to identify unmet needs and service gaps, recommend innovative transportation access solutions, and empower communities to climb "ladders of opportunity" toward greater social and economic mobility. `,
    42,
    110,
    { maxWidth: pageWidth - 75 },
  );
  doc.text(
    `This report contains contains numerical totals of vulnerable populations, essential services, and essential services accessible by transit within this census block group. Analysis from this data was used to determine regional ranks and scores for these categories. For more information on this data, visit: `,
    42,
    190,
    { maxWidth: pageWidth - 75 },
  );
  doc.setTextColor(0, 0, 255);
  doc.textWithLink('ETA - Priority Score', 97, 231, {
    url: 'https://catalog.dvrpc.org/dataset/equity-through-access-priority-score',
  });
  doc.setTextColor(0, 0, 0);

  await doc.html(legendWrapper, {
    callback: function (doc) {
      return doc;
    },
    html2canvas: { scale: 0.65 },
    x: 130,
    y: 240,
  });

  // await doc.html(contextLegend, {
  //   callback: function (doc) {
  //     return doc;
  //   },
  //   html2canvas: { scale: 0.25 },
  //   x: 80,
  //   y: 88,
  // });

  let imageStartY = 300;
  if (selectedLayer === 'priority' || selectedLayer === 'mismatch') imageStartY += 4;

  doc.addImage(src, 'PNG', pageWidth * 0.05, imageStartY, imageWidth, imageHeight);

  doc.addPage();
  doc.addImage(dvrpcLogo, 'PNG', 20, 20, 90, 36);
  doc.setFontSize(7);
  doc.text(currentDate, 35, 65);
  doc.setFontSize(14);

  doc.text('Block Group Summary', 42, 90);
  doc.autoTable(getTable(bgTable, data, 97));

  doc.text('Vulnerable Populations', 42, 207);
  doc.autoTable(getTable(vpTable, data, 214));

  doc.text('Essential Services', 42, 347);
  doc.autoTable(getTable(esTable, data, 354));

  doc.text('Population-Service Mismatch', 42, 600);
  doc.autoTable(getTable(psmTable, data, 607));

  doc.addPage();
  doc.addImage(dvrpcLogo, 'PNG', 20, 20, 90, 36);
  doc.setFontSize(7);
  doc.text(currentDate, 35, 65);
  doc.setFontSize(14);

  doc.text('Transit Accessibility (45 Min Travel)', 42, 90);
  doc.autoTable(getTable(taTable, data, 97));

  doc.text('Priority Score', 42, 207);
  doc.autoTable(getTable(psTable, data, 214));

  doc.text('Data Sources', 42, 290);
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(14);

  doc.text(
    `DVRPC (Circuit Trails, 2020; Parks/Open Space, 2016), DVRPC Pedestrian Network (2022), DVRPC Travel Models (2023), Overture Maps (2024), HRSA (2020), NETS (2015), National Center for Education Statistics (NCES 2017-2018), SEPTA (2024), NJT (2024), PATCO (2024), U.S. Census, ACS 2018-2022 5-Year Estimates. 
     ACS data are derived from a survey and are subject to sampling variability.`,
    42,
    307,
    { maxWidth: pageWidth - 75 },
  );

  doc.save(`eta_report_${data.geoid}.pdf`);
};

export { handlePrint };
