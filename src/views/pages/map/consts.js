const vulnerableColorEnds = ['#dadaeb', '#3f007d'];
const essentialColorStops = ['#BCE6F9', '#74BBED', '#4D96CE', '#48799D', '#404D54'];
const mismatchColorStops = [
  '#58708D',
  '#6990B9',
  '#4D96CE',
  '#ABC7D6',
  '#CFDAE0',
  '#E9D4C8',
  '#E4B5A0',
  '#D28C81',
  '#BD626E',
];
const priorityScoreColorStops = {
  '#b2182b': 17.5,
  '#d6604d': 17.5,
  '#f4a582': 17.5,
  '#fddbc7': 17.5,
  '#828282': 40,
  '#d1e5f0': 17.5,
  '#92c5de': 17.5,
  '#4393c3': 17.5,
  '#2166ac': 17.5,
};
const transitColorEnds = ['#FAF360', '#75ABAD'];

const vulnerableDescriptionHTML = `
<details class='layer-description'>
  <summary> show/hide description </summary>
  <p>
    <span >Some demographic groups face greater mobility challenges and are therefore more affected by changes in the built environment than others. 
    To better understand the spatial distribution and overall needs of these populations, locations of vulnerable populations are mapped here.
    Based on stakeholder interviews and input during the course of the project, three primary vulnerable populations were identified:</span>
  </p>
  <br/>
  <ul>
    <li><span >Households that Include One or More Disabled Person(s)</span></li>
    <li><span >Households In Poverty</span></li>
    <li><span >People Aged 65 and Over</span></li>
  </ul>
  <br/>
  <p>
    <span >Using American Community Survey (ACS) data at the block group level, the three characteristics were combined and ranked 1 through 10. 
    Lower values were assigned to areas with fewer vulnerable populations, and higher values were assigned to areas with more vulnerable populations. 
    Click on an area of interest on the map to view the detailed data.</span>
  </p>
  <br/>
  <p><em>Source: US Census Bureau ACS 2018 5-year estimates</em></p>
</details>`;

const essentialDescriptionHTML = `
<details class='layer-description'>
  <summary> show/hide description </summary>
  <p>
    The ETA project identified essential services as places of employment, grocery stores, schools, medical care facilities, recreation/open space, 
    senior centers, and centers for the developmentally disabled. For those with limited travel options, quality of life can be greatly diminished by 
    lack of access to essential services, as described in <a href="https://www.transportation.gov/opportunity" target="_blank">USDOT&rsquo;s Ladders of Opportunity</a> 
    initiative. This map highlights areas with higher and lower opportunity.
  </p>
  <br/>
  <p>
    Using a variety of sources, essential services were combined by block group and ranked 1 through 10. Lower values were assigned to areas with fewer 
    essential services, and higher values were assigned to areas with more essential services. Click on an area of interest 
    on the map to view the detailed data related to each of the layers.
  </p>
  <br/>
  <p><em>Sources: DVRPC (Circuit Trails, 2020; Parks/Open Space, 2016), HRSA (2020), NCES (2017-2018), NETS (2015)</em></p>
</details>`;

const mismatchDescriptionHTML = `
<details class='layer-description'>
  <summary> show/hide description </summary>
  <p> 
    Understanding the spatial mismatch between the areas of vulnerable populations and locations of essential services is key to this project. 
    This map highlights areas with a greater mismatch.
  </p>
  <br/>
  <p>
    Values from the Essential Services layer were subtracted from the values of the Vulnerable Populations layer to find differences in the rankings. 
    Negative values indicate areas with more essential services and fewer vulnerable populations. 
    Positive values indicate areas with fewer essential services and more vulnerable populations. 
  </p>
</details>`;

const transitDescriptionHTML = `
<details class='layer-description'>
  <summary> show/hide description </summary>
  <p>
    The spatial mismatch between vulnerable populations and essential services becomes more severe when public transit access is unavailable 
    to help bridge the gap. This map reflects a composite measure of regional public transit accessibility, considering:
  </p>
  <br/>
  <ul>
    <li>How many areas a person could access in a 45 minute transit trip</li>
    <li>The general number of essential services accessible in a 45 minute transit trip</li>
    <li>Frequency of service</li>
    <li>Walkability of the block group to transit stations/stops</li>
  </ul>
  <br/>
  <p>
    Using accessibility data at the block group level, the four characteristics were combined and ranked 1 through 10. Higher values were 
    assigned to areas that are less accessible by transit, and lower values were assigned to areas that are more accessible by transit. 
    Click on an area of interest on the map to view the detailed data.
  </p>
  <br/>
  <p><em>Sources: DVRPC Travel Models (2023), Overture Maps (2024), SEPTA (2024), NJT (2024), PATCO (2024)</em></p>
</details>`;

const priorityDescriptionHTML = `
<details class='layer-description'>
  <summary> show/hide description </summary>
  <p> 
    Combining the Population-Services Mismatch and Transit Accessibility maps helps us visualize the locations in our region that have a relatively high level of spatial mismatch, 
    combined with relatively poor regional transit connectivity. Areas with a higher divergence represent access gaps, and help 
    suggest new public transit connections that could be made, changed, or improved to bridge these gaps in the future.
  </p>
  <br/>
  <p>
    Values from the Population-Services Mismatch layer were multiplied by the Transit Accessibility layer to identify access gaps. 
    A low negative value indicates areas where there are more essential services with low transit accessibility. 
    A high positive number indicates areas where there are more vulnerable populations with low transit accessibility. 
  </p>
</details>`;

const defaultSidebarInfo = `
  <h2>About the Equity Through Access (ETA) Map Toolkit:</h2>
  <p>This web map visually walks you through the analysis DVRPC performed to create the ETA Priority
    Score, a layer that helps users visualize where there is a potentially high need to improve transit
    service for vulnerable populations to reach essential services in the Greater Philadelphia region. To
    see how this toolkit can be used to answer a planning question, refer to the case study
    <a href="http://www.dvrpc.org/eta/CaseStudies/pdf/Lower_Bucks_Case_Study.pdf" target="_blank"><span
        >&ldquo;Putting the Equity Through Access Map Toolkit to Work in Lower Bucks County.&rdquo;</span
      ></a
    ></span>
  </p>
  <br/>
  <h4>Exploring the Data:</h4>
  <p>Select <i>Base Layers and Themes</i> to expand the legend overlay, and select a different map theme to display different layers.</p>
  <p>Find your area of interest by clicking on the magnifying glass at the top right of the map, and type in your
      town&rsquo;s name or ZIP code. Pan and zoom using the arrows just below the search bar or use your
      mouse.
  </p>
  <p>
    Click on features in the map to view more information about the data in the sidebar.
  </p>
  <br/>
  <p>
    <strong>Vulnerable Populations </strong>answers the question, &ldquo;Who lives here?&rdquo;
      and highlights populations in need.
  </p>
  <p>
    <strong>Essential Services</strong> answers the question, &ldquo;Where do people need to
      go?&rdquo; and highlights areas with more services in the region.
  </p>
  <p>
    <strong>Population-Services Mismatch</strong> answers the question, &ldquo;Where is there a
      gap between areas of need and essential services?&rdquo; This layer highlights areas where there are
      higher numbers of vulnerable populations but fewer essential services and vice versa.
  </p>
  <p>
    <strong>Transit Accessibility </strong>answers the question, &ldquo;How is transit service
      distributed?&rdquo; and highlights areas in the region with lower transit accessibility.
  </p>
  <p>
    <strong>Priority Score</strong> answers the question, &ldquo;Where can transit service be
      improved to help vulnerable populations access essential services?&rdquo; This layer, the result of
      our analysis, highlights areas with higher numbers of vulnerable populations or essential services,
      but lower transit accessibility and vice versa.
  </p>
  <br/>
  <h3>Data Sources:</h3>
  <p>
    <i>DVRPC (Circuit Trails, 2020; Parks/Open Space, 2016), DVRPC Pedestrian Network (2022), DVRPC Travel Models (2023), Overture Maps (2024), HRSA (2020), NETS (2015), National Center for Education Statistics (NCES 2017-2018), SEPTA (2024), NJT (2024), PATCO (2024), U.S. Census, ACS 2018-2022 5-Year Estimates. 
    ACS data are derived from a survey and are subject to sampling variability.</i>
  </p>`;

const vulnerableLegendDescription = `
    Lower values were assigned to areas with fewer vulnerable populations, and higher values were assigned to areas with more 
    vulnerable populations.
`;

const essentialLegendDescription = `
    Lower values were assigned to areas with fewer essential services, and higher values were assigned to areas with more essential services.
`;

const mismatchLegendDescription = `
    Negative values indicate areas with more essential services and fewer vulnerable populations. Positive values indicate areas with fewer essential services and more vulnerable populations. 
`;

const transitLegendDescription = `
    Lower values were assigned to areas that are more accessible by transit, and higher values were assigned to areas that are less accessible by transit. 
`;

const priorityLegendDescription = `
    A low negative value represents areas where there are more essential services with low transit accessibility. A high positive number indicates areas where there are more vulnerable populations with low transit accessibility.
`;
const removeSelectionPopup = `
  <button>
    <p>Remove Selection</p>
    <span> x </span>
  </button>
`;

const descriptionMap = {
  vulnerable: vulnerableDescriptionHTML,
  essential: essentialDescriptionHTML,
  mismatch: mismatchDescriptionHTML,
  transit: transitDescriptionHTML,
  priority: priorityDescriptionHTML,
};

const legendDescriptionMap = {
  vulnerable: vulnerableLegendDescription,
  essential: essentialLegendDescription,
  mismatch: mismatchLegendDescription,
  transit: transitLegendDescription,
  priority: priorityLegendDescription,
};

const layerTitleMap = {
  vulnerable: 'Vulnerable Populations',
  essential: 'Essential Services',
  mismatch: 'Population-Services Mismatch',
  transit: 'Transit Accessibility',
  priority: 'Priority Score',
};

const countyLookup = {
  34007: 'Camden County',
  34015: 'Gloucester County',
  34021: 'Mercer County',
  34005: 'Burlington County',
  42017: 'Bucks County',
  42029: 'Chester County',
  42045: 'Delaware County',
  42101: 'Philadelphia County',
  42091: 'Montgomery County',
};

export {
  vulnerableColorEnds,
  essentialColorStops,
  mismatchColorStops,
  transitColorEnds,
  priorityScoreColorStops,
  descriptionMap,
  legendDescriptionMap,
  defaultSidebarInfo,
  countyLookup,
  layerTitleMap,
};
