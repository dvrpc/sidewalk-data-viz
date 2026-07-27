import { countyLookup, descriptionMap } from './consts';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { numberWithCommas } from './utils';
const sidebarInfo = document.getElementById('BGInfo');
const removeSelectionButton = document.getElementById('remove-selection-btn');

const getVulnerableTable = (props) => {
  return `
        <div>
            <div class="flex flex-between">
                <h3>Vulnerable Populations</h3>
                <div class='rank-icon-wrapper'>Rank&nbsp;&nbsp;<span class='rank-icon'>${
                  props.vul_pop_rank
                }</span></div>
            </div>
            <table class='data-table'>
                <tr>
                    <th scope='col'></th>
                    <th scope='col'>Total</th>
                    <th scope='col'>Pct</th>
                </tr>
                <tr>
                    <td class='data-info'>Households with 1 or More People with Disability</td>
                    <td class='data-value-multi'>${props.hh_dis}</td>
                    <td class='data-value-multi'>${
                      props.hh_dis !== 0 ? ((props.hh_dis / props.hh) * 100).toFixed(1) : 0
                    }%</td>
                </tr>
                <tr>
                    <td class='data-info'>Number of Households Below Poverty Line</td>
                    <td class='data-value-multi'>${props.hh_pov}</td>
                    <td class='data-value-multi'>${
                      props.hh_pov !== 0 ? ((props.hh_pov / props.hh) * 100).toFixed(1) : 0
                    }%</td>
                </tr>

                <tr>
                    <td class='data-info'>People 65 or Older</td>
                    <td class='data-value-multi'>${props.pop65}</td>
                    <td class='data-value-multi'>${
                      props.pop65 !== 0 ? ((props.pop65 / props.pop) * 100).toFixed(1) : 0
                    }%</td>
                </tr>          
            </table>
        </div>`;
};

const getEssentialServicesTable = (props) => {
  return `
          <div>
                <div class="flex flex-between">
                    <h3>Essential Services</h3>
                    <div class='rank-icon-wrapper'>Rank&nbsp;&nbsp;<span class='rank-icon'>${props.es_rank}</span></div>
                </div>
              <table class='data-table'>
                  <tr>
                      <th scope='col'></th>
                      <th scope='col'></th>
                  </tr>
                  <tr>
                      <td class='data-info'>Activity Centers for Seniors or Disabled</td>
                      <td class='data-value'>${props.ss_cnt}</td>
                  </tr>
                  <tr>
                      <td class='data-info'>Food Stores</td>
                      <td class='data-value'>${props.food_cnt}</td>
                  </tr>
  
                  <tr>
                      <td class='data-info'>Health Care Facilities</td>
                      <td class='data-value'>${props.hc_cnt}</td>
                  </tr>   
                  <tr>
                      <td class='data-info'>Number of Educational Institutions</td>
                      <td class='data-value'>${props.school_cnt}</td>
                  </tr>
                  <tr>
                      <td class='data-info'>Parks/Outdoor Spaces Present</td>
                      <td class='data-value'>${props.os_check === 1 ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                      <td class='data-info'>Trails</td>
                      <td class='data-value'>${props.trail_cnt}</td>
                  </tr>
                  <tr>
                      <td class='data-info'>Essential Services Total</td>
                      <td class='data-value'>${numberWithCommas(props.es_sum)}</td>
                  </tr>      
                  <tr>
                      <td class='data-info'>Jobs</td>
                      <td class='data-value'>${numberWithCommas(props.sum_jobs)}</td>
                  </tr>       
              </table>
          </div>`;
};

const getMismatchTable = (props) => {
  return `
            <div>
                <h3>Population-Services Mismatch</h3>
                <table class='data-table'>
                    <tr>
                        <th scope='col'></th>
                        <th scope='col'></th>
                    </tr>
                    <tr>
                        <td class='data-info'>Vulnerable Population Rank</td>
                        <td class='data-value'>${props.vul_pop_rank}</td>
                    </tr>
                    <tr>
                        <td class='data-info'>Essential Services Rank</td>
                        <td class='data-value'>${props.es_rank}</td>
                    </tr>
                    <tr>
                        <td class='data-info'>Access Gap</td>
                        <td class='data-value emphasized-value'>${props.access_gap_rank}</td>
                    </tr>     
                </table>
            </div>`;
};

const getTransitTable = (props) => {
  return `
  <div>
      <div class="flex flex-between">
        <h3>Transit Accessibility</h3>
        <div class='rank-icon-wrapper'>Rank&nbsp;&nbsp;<span class='rank-icon'>${props.transit_access_rank}</span></div>
      </div>
      <table class='data-table'>
          <tr>
              <th scope='col'></th>
              <th scope='col' style="text-align: right">45 min transit access</th>
          </tr>
          <tr>
              <td class='data-info'>Transit Accessible Zones</td>
              <td class='data-value'>${numberWithCommas(props.t_45min_zone_cnt)}</td>
          </tr>
          <tr>
              <td class='data-info'>Essential Services</td>
              <td class='data-value'>${numberWithCommas(props.t_es_cnt)}</td>
          </tr>
          <tr>
              <td class='data-info'>Jobs</td>
              <td class='data-value'>${numberWithCommas(Math.round(props.t_jobs_cnt))}</td>
              <td class='data-value'></td>

          </tr>
          <tr>
              <td class='data-info'>Daily Departures</td>
              <td class='data-value'>${numberWithCommas(Math.round(props.total_departures))}</td>
          </tr>
                    <tr>
              <td class='data-info'>Walkability Rank</td>
              <td class='data-value'>${Math.round(props.walkshed_quantile)}</td>
          </tr>
      </table>
  </div>`;
};

const getPriorityScoreTable = (props) => {
  return `
              <div>
                  <h3>Priority Score</h3>
                  <table class='data-table'>
                      <tr>
                          <th scope='col'></th>
                          <th scope='col'></th>
                      </tr>
                      <tr>
                          <td class='data-info'>Priority Score</td>
                          <td class='data-value emphasized-value'>${props.eta_score}</td>
                      </tr>
                      <tr>
                          <td class='data-info'>Priority Score Type</td>
                          <td class='data-value'>${
                            Math.abs(props.eta_score) < 20 ? 'Balanced Concentration' : 'Unbalanced Concentration'
                          }</td>
                      </tr>    
                  </table>
              </div>`;
};

const handleBlockGroups = (props, layer) => {
  let bgName = `

    <div class='bg-title'>
        <h2>Block Group ID: ${props.geoid}</h2>
        <span>${props.mun1}, ${countyLookup[props.geoid.substring(0, 5)]}</span>
    </div>
    <div class='action-icon-wrapper'>
        <div id='download-button' class="action-icon">
            <i class="fa-solid fa-download"></i>
            Download Data
        </div>
        <div id='print-button' class="action-icon">
            <i class="fa-solid fa-print"></i>
            Print Report
        </div>
    </div>
  `;

  let bgInfo = `
    <div class='table-wrapper'>
        <div class='bg-summary'>
            <h3><i class='fa fa-users' aria-hidden='true'></i>&nbsp;&nbsp;Block Group Summary</h3>
            <table class='data-table'>
                <tr>
                    <th scope='col'></th>
                    <th scope='col'></th>
                </tr>
                <tr>
                    <td class='data-info'>Population</td>
                    <td class='data-value'>${numberWithCommas(props.pop)}</td>
                </tr>
                <tr>
                    <td class='data-info'>Households</td>
                    <td class='data-value'>${numberWithCommas(props.hh)}</td>
                </tr>
                <tr>
                    <td class='data-info'>Jobs</td>
                    <td class='data-value'>${numberWithCommas(props.sum_jobs)}</td>
                </tr>
            </table>
        </div>
    </div>
    <div class='layer-description'>
        <span>To calculate <b>ranks</b> for each category, all block groups in the region were divided into 10 quantile bins of even size. A rank of 1 indicates that the selected block group's
        value for a given category fell into the lowest quantile bin for the region. A rank of 10 indicates that the value fell into the highest bin in the region.</span>
    </div>

    `;

  const tables = {
    vulnerable: getVulnerableTable(props),
    essential: getEssentialServicesTable(props),
    mismatch: getMismatchTable(props),
    transit: getTransitTable(props),
    priority: getPriorityScoreTable(props),
  };

  let sidebarTableHTML = '';

  sidebarTableHTML += '<div class="table-wrapper focused">';
  sidebarTableHTML += tables[layer];
  let openDescription = descriptionMap[layer];
  const insertIndex = openDescription.indexOf('>');
  openDescription = openDescription.slice(0, insertIndex) + ' open=""' + openDescription.slice(insertIndex);
  sidebarTableHTML += openDescription;
  sidebarTableHTML += '</div>';

  delete tables[layer];

  for (const [layer, tableHTML] of Object.entries(tables)) {
    sidebarTableHTML += '<div class="table-wrapper">';
    sidebarTableHTML += tableHTML;
    sidebarTableHTML += descriptionMap[layer];

    sidebarTableHTML += '</div>';
  }

  return bgName + bgInfo + sidebarTableHTML;
};

const clickFill = (e, map) => {
  const features = e.features[0];
  const props = features.properties;
  let geo;
  if (features.geometry.coordinates.length > 1) {
    geo = features.geometry.coordinates[0][0];
  } else {
    geo = features.geometry.coordinates[0];
  }

  const geoMid = Math.floor(geo.length / 2);
  const a = geo[0];
  const b = geo[geoMid];

  let selectedId = localStorage.getItem('state_selectedId');

  const currentZoom = map.getZoom();

  map.fitBounds([a, b], {
    padding: { top: 0, bottom: 30, left: 0, right: 0 },
    maxZoom: currentZoom > 13 ? currentZoom : 13,
  });

  if (selectedId.length) {
    map.setFeatureState({ source: 'eta', sourceLayer: 'eta_score', id: selectedId }, { selected: false });
  }

  selectedId = e.features[0].id;

  map.setFeatureState({ source: 'eta', sourceLayer: 'eta_score', id: selectedId }, { selected: true });

  let selectedLayer = localStorage.getItem('state_selectedLayer');

  const text = handleBlockGroups(props, selectedLayer);
  sidebarInfo.innerHTML = text;
  removeSelectionButton.style.visibility = 'visible';
  localStorage.setItem('state_selectedId', selectedId);
  localStorage.setItem('state_selectedAttributes', JSON.stringify(props));
};

export { clickFill, handleBlockGroups };
