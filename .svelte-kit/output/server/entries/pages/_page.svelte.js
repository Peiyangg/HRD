import { c as create_ssr_component, e as each, v as validate_component } from "../../chunks/ssr.js";
import * as d3 from "d3";
import { e as escape } from "../../chunks/escape.js";
const css$1 = {
  code: ".outer-container.svelte-1lropm6{width:80vw;height:75vh;position:relative;display:flex;flex-direction:column;margin-top:10vh ;margin-left:5vw}.content-container.svelte-1lropm6{display:flex;height:80vh}.left-labels.svelte-1lropm6{display:flex;flex-direction:column;justify-content:space-between;width:10vw;padding-right:10px}.metadata-labels.svelte-1lropm6{height:20vh;display:flex;flex-direction:column;justify-content:space-around}.topic-labels.svelte-1lropm6{height:65vh;display:flex;flex-direction:column;justify-content:space-between;padding-top:10px}.label.svelte-1lropm6{font-size:10px;text-align:right}.grid-container.svelte-1lropm6{display:flex;flex-direction:column;width:85vw}.metadata-grid.svelte-1lropm6{display:grid;grid-template-rows:repeat(6, 1fr);grid-template-columns:repeat(60, 1fr);gap:1px;height:20vh;margin-bottom:1vh}.metadata-rect.svelte-1lropm6{width:100%;height:100%}.heatmap-grid.svelte-1lropm6{display:grid;grid-template-columns:repeat(60, 1fr);grid-template-rows:repeat(9, 1fr);gap:1px;height:65vh}.rect.svelte-1lropm6{width:100%;height:100%;cursor:pointer}.tooltip{position:absolute;text-align:left;padding:8px;font:12px sans-serif;background:#fff;border:1px solid #ddd;border-radius:4px;pointer-events:none}.x-axis.svelte-1lropm6{height:5vh;width:85vw;margin-left:9vw;display:flex;justify-content:flex-start;align-items:flex-start;font-size:8px;padding-top:5px}.x-label.svelte-1lropm6{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:100%;width:1.09vw;margin-right:0.1vw}",
  map: `{"version":3,"file":"heatmap_9.svelte","sources":["heatmap_9.svelte"],"sourcesContent":["<script>\\n  import * as d3 from 'd3';\\n  import { onMount } from 'svelte';\\n  export let data = [];\\n\\n  // Define the fields for categorical data\\n  const metadataFields = [\\"Greenhouse\\", \\"SampleTime\\", \\"Diagnosis\\", \\"Treatment\\", \\"Rootstock\\", \\"Scion\\"];\\n  const topics = [\\"Topic_0\\", \\"Topic_1\\", \\"Topic_2\\", \\"Topic_3\\", \\"Topic_4\\", \\"Topic_5\\", \\"Topic_6\\", \\"Topic_7\\", \\"Topic_8\\"];\\n  const rootstockColors = ['#484C62', '#487E86', '#C3675D'];\\n  const sampleTimeColors = {\\n    1: '#eff3ff',\\n    2: '#bdd7e7',\\n    3: '#6baed6',\\n    4: '#3182bd',\\n    5: '#08519c'\\n  };\\n\\n  const greenhouseColors = [\\n    'rgb(196, 216, 227)',  // Light Blue\\n    'rgb(105, 150, 180)',  // Dark Blue\\n    'rgb(200, 223, 180)',  // Light Green\\n    'rgb(105, 160, 101)',  // Dark Green\\n    'rgb(251, 202, 202)',  // Light Pink\\n    'rgb(227, 126, 127)',  // Red\\n    'rgb(253, 222, 182)',  // Light Orange\\n    'rgb(255, 191, 127)',  // Orange\\n    'rgb(207, 196, 214)',  // Lavender\\n    'rgb(130, 107, 154)',  // Purple\\n    'rgb(255, 255, 204)',  // Light Yellow\\n    'rgb(189, 144, 109)'   // Brown\\n  ];\\n\\n  const diagnosisColors = {\\n    \\"infested\\": \\"rgb(150, 84, 84)\\",\\n    \\"healthy\\": \\"rgb(123, 139, 111)\\",\\n    \\"before\\": \\"rgb(101, 101, 101)\\"\\n  };\\n\\n  const treatmentColors = [\\n    'rgb(228, 127, 128)',  // Red\\n    'rgb(119, 155, 184)',  // Blue\\n    'rgb(125, 175, 124)',  // Green\\n    'rgb(157, 120, 163)',  // Purple\\n    'rgb(255, 191, 127)',  // Orange\\n    'rgb(255, 255, 153)'   // Yellow\\n  ];\\n\\n  \\n\\n  // Color scale for continuous data (topics)\\n  function getColor(value) {\\n  // Start with off-white (e.g., rgb(255, 240, 240)) to red (rgb(255, 0, 0))\\n  const redScale = Math.floor(255 * value);  // Red channel increases with value\\n  const otherChannels = Math.floor(240 * (1 - value));  // Green and blue channels decrease\\n\\n  return \`rgb(255, \${otherChannels}, \${otherChannels})\`;\\n}\\n\\n  // Generate unique values for categorical data and create color scales using d3\\n  let colorScales = {};\\n\\n  metadataFields.forEach((field) => {\\n    let uniqueValues = [...new Set(data.map(d => d[field]))];\\n    \\n    // Assign specific custom colors for 'SampleTime' values (1-5)\\n    if (field === 'SampleTime') {\\n      colorScales[field] = (value) => sampleTimeColors[value] || '#ccc';  // Assign custom colors or fallback\\n    } \\n    // Custom colors for Rootstock\\n    else if (field === 'Rootstock') {\\n      colorScales[field] = d3.scaleOrdinal()\\n        .domain(uniqueValues)\\n        .range(rootstockColors);  // Apply custom colors for Rootstock\\n    } \\n    // Custom colors for Treatment\\n    else if (field === 'Treatment') {\\n      colorScales[field] = d3.scaleOrdinal()\\n        .domain(uniqueValues)\\n        .range(treatmentColors);  // Use fixed colors for Treatment\\n    }\\n    // Custom colors for Greenhouse (fixed set)\\n    else if (field === 'Greenhouse') {\\n      colorScales[field] = d3.scaleOrdinal()\\n        .domain(uniqueValues)\\n        .range(greenhouseColors);  // Use fixed colors for Greenhouse\\n    } \\n    else if (field !== 'Diagnosis') {\\n      // Use default d3.schemeCategory10 for other fields (except Diagnosis)\\n      colorScales[field] = d3.scaleOrdinal()\\n        .domain(uniqueValues)\\n        .range(d3.schemeCategory10); \\n    }\\n  });\\n\\n  // Function to get color for categorical data using D3's color scale or custom for Diagnosis\\n  function getMetadataColor(field, value) {\\n    if (field === \\"Diagnosis\\" && diagnosisColors[value]) {\\n      return diagnosisColors[value]; // Custom colors for Diagnosis values\\n    } else if (colorScales[field]) {\\n      return colorScales[field](value); // Use D3 color scales for other fields\\n    }\\n    return '#ccc'; // Fallback color if scale or custom color is not found\\n  }\\n\\n  let selectedRect = null;\\n  let tooltip = null;\\n  let tooltipContent = '';\\n\\n  let selectedItem = null;\\n  let selectedTopic = null;\\n\\n  onMount(() => {\\n    tooltip = d3.select('body').append('div')\\n      .attr('class', 'tooltip')\\n      .style('opacity', 0);\\n  });\\n\\n  function handleClick(item,topic) {\\n      selectedItem = item;\\n      selectedTopic=topic;\\n\\n\\n    // Prepare tooltip content\\n    tooltipContent = \`\\n      <strong>Average ID:</strong> \${item.averageID}<br>\\n      <strong>\${topic}:</strong> \${item[topic]}<br>\\n      <strong>Greenhouse:</strong> \${item.Greenhouse}<br>\\n      <strong>Sample Time:</strong> \${item.SampleTime}<br>\\n      <strong>Diagnosis:</strong> \${item.Diagnosis}<br>\\n      <strong>Treatment:</strong> \${item.Treatment}<br>\\n      <strong>Rootstock:</strong> \${item.Rootstock}<br>\\n      <strong>Scion:</strong> \${item.Scion}\\n    \`;\\n\\n    // Show tooltip\\n    tooltip.transition()\\n      .duration(200)\\n      .style('opacity', .9);\\n    tooltip.html(tooltipContent)\\n      .style('left', (event.pageX + 10) + 'px')\\n      .style('top', (event.pageY - 28) + 'px');\\n  }\\n\\n  function hideTooltip() {\\n    tooltip.transition()\\n      .duration(500)\\n      .style('opacity', 0);\\n  }\\n<\/script>\\n\\n<style>\\n  .outer-container {\\n    width: 80vw;\\n    height: 75vh;\\n    position: relative;\\n    display: flex;\\n    flex-direction: column;\\n    margin-top: 10vh ;\\n    margin-left: 5vw;\\n  }\\n\\n  .content-container {\\n    display: flex;\\n    height: 80vh;\\n  }\\n\\n  .left-labels {\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: space-between;\\n    width: 10vw;\\n    padding-right: 10px;\\n  }\\n\\n  .metadata-labels {\\n    height: 20vh;\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: space-around;\\n  }\\n\\n  .topic-labels {\\n    height: 65vh;\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: space-between;\\n    padding-top: 10px;\\n  }\\n\\n  .label {\\n    font-size: 10px;\\n    text-align: right;\\n  }\\n\\n  .grid-container {\\n    display: flex;\\n    flex-direction: column;\\n    width: 85vw;\\n  }\\n\\n  .metadata-grid {\\n    display: grid;\\n    grid-template-rows: repeat(6, 1fr);\\n    grid-template-columns: repeat(60, 1fr);\\n    gap: 1px;\\n    height: 20vh;\\n    margin-bottom: 1vh;\\n  }\\n\\n  .metadata-rect {\\n    width: 100%;\\n    height: 100%;\\n  }\\n\\n  .heatmap-grid {\\n    display: grid;\\n    grid-template-columns: repeat(60, 1fr);\\n    grid-template-rows: repeat(9, 1fr);\\n    gap: 1px;\\n    height: 65vh;\\n  }\\n\\n  .rect {\\n    width: 100%;\\n    height: 100%;\\n    cursor: pointer;\\n  }\\n\\n  .rect.selected {\\n    stroke: #000;\\n    stroke-width: 5px;\\n  }\\n\\n  :global(.tooltip) {\\n    position: absolute;\\n    text-align: left;\\n    padding: 8px;\\n    font: 12px sans-serif;\\n    background: #fff;\\n    border: 1px solid #ddd;\\n    border-radius: 4px;\\n    pointer-events: none;\\n  }\\n\\n  .x-axis {\\n    height: 5vh;\\n    width: 85vw;\\n    margin-left: 9vw;\\n    display: flex;\\n    justify-content: flex-start;\\n    align-items: flex-start;\\n    font-size: 8px;\\n    padding-top: 5px;\\n  }\\n\\n  .x-label {\\n    writing-mode: vertical-rl;\\n    text-orientation: mixed;\\n    transform: rotate(180deg);\\n    white-space: nowrap;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n    max-height: 100%;\\n    width: 1.09vw; /* Set the width to 1.41vw as requested */\\n    margin-right: 0.1vw; /* Adjust spacing between labels */\\n\\n  }\\n</style>\\n\\n<div class=\\"outer-container\\">\\n  <div class=\\"content-container\\">\\n    <div class=\\"left-labels\\">\\n      <div class=\\"metadata-labels\\">\\n        {#each metadataFields as field}\\n          <div class=\\"label\\">{field}</div>\\n        {/each}\\n      </div>\\n      <div class=\\"topic-labels\\">\\n        {#each topics as topic}\\n          <div class=\\"label\\">{topic}</div>\\n        {/each}\\n      </div>\\n    </div>\\n\\n    <div class=\\"grid-container\\">\\n      <div class=\\"metadata-grid\\">\\n        {#each metadataFields as field}\\n          {#each data as item}\\n            <div class=\\"metadata-rect\\" style=\\"background-color: {getMetadataColor(field, item[field])}\\"></div>\\n          {/each}\\n        {/each}\\n      </div>\\n\\n      <div class=\\"heatmap-grid\\">\\n        {#each topics as topic}\\n          {#each data as item}\\n            <div \\n              class=\\"rect\\" \\n              style=\\"background-color: {getColor(parseFloat(item[topic]))}\\"\\n              on:click={() => handleClick(item,topic)}\\n              on:mouseleave={hideTooltip}\\n            ></div>\\n          {/each}\\n        {/each}\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"x-axis\\">\\n    {#each data as item}\\n      <div class=\\"x-label\\">{item.averageID}</div>\\n    {/each}\\n  </div>\\n</div>"],"names":[],"mappings":"AAuJE,+BAAiB,CACf,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,IAAI,CAAC,CACjB,WAAW,CAAE,GACf,CAEA,iCAAmB,CACjB,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IACV,CAEA,2BAAa,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,aAAa,CAC9B,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,IACjB,CAEA,+BAAiB,CACf,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,YACnB,CAEA,4BAAc,CACZ,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,IACf,CAEA,qBAAO,CACL,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,KACd,CAEA,8BAAgB,CACd,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,IACT,CAEA,6BAAe,CACb,OAAO,CAAE,IAAI,CACb,kBAAkB,CAAE,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,CAClC,qBAAqB,CAAE,OAAO,EAAE,CAAC,CAAC,GAAG,CAAC,CACtC,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GACjB,CAEA,6BAAe,CACb,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IACV,CAEA,4BAAc,CACZ,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,EAAE,CAAC,CAAC,GAAG,CAAC,CACtC,kBAAkB,CAAE,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,CAClC,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IACV,CAEA,oBAAM,CACJ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OACV,CAOQ,QAAU,CAChB,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,GAAG,CACZ,IAAI,CAAE,IAAI,CAAC,UAAU,CACrB,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,cAAc,CAAE,IAClB,CAEA,sBAAQ,CACN,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,UAAU,CAC3B,WAAW,CAAE,UAAU,CACvB,SAAS,CAAE,GAAG,CACd,WAAW,CAAE,GACf,CAEA,uBAAS,CACP,YAAY,CAAE,WAAW,CACzB,gBAAgB,CAAE,KAAK,CACvB,SAAS,CAAE,OAAO,MAAM,CAAC,CACzB,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,MAAM,CACb,YAAY,CAAE,KAEhB"}`
};
function getColor(value) {
  const otherChannels = Math.floor(240 * (1 - value));
  return `rgb(255, ${otherChannels}, ${otherChannels})`;
}
const Heatmap_9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data = [] } = $$props;
  const metadataFields = ["Greenhouse", "SampleTime", "Diagnosis", "Treatment", "Rootstock", "Scion"];
  const topics = [
    "Topic_0",
    "Topic_1",
    "Topic_2",
    "Topic_3",
    "Topic_4",
    "Topic_5",
    "Topic_6",
    "Topic_7",
    "Topic_8"
  ];
  const rootstockColors = ["#484C62", "#487E86", "#C3675D"];
  const sampleTimeColors = {
    1: "#eff3ff",
    2: "#bdd7e7",
    3: "#6baed6",
    4: "#3182bd",
    5: "#08519c"
  };
  const greenhouseColors = [
    "rgb(196, 216, 227)",
    "rgb(105, 150, 180)",
    "rgb(200, 223, 180)",
    "rgb(105, 160, 101)",
    "rgb(251, 202, 202)",
    "rgb(227, 126, 127)",
    "rgb(253, 222, 182)",
    "rgb(255, 191, 127)",
    "rgb(207, 196, 214)",
    "rgb(130, 107, 154)",
    "rgb(255, 255, 204)",
    "rgb(189, 144, 109)"
  ];
  const diagnosisColors = {
    "infested": "rgb(150, 84, 84)",
    "healthy": "rgb(123, 139, 111)",
    "before": "rgb(101, 101, 101)"
  };
  const treatmentColors = [
    "rgb(228, 127, 128)",
    "rgb(119, 155, 184)",
    "rgb(125, 175, 124)",
    "rgb(157, 120, 163)",
    "rgb(255, 191, 127)",
    "rgb(255, 255, 153)"
  ];
  let colorScales = {};
  metadataFields.forEach((field) => {
    let uniqueValues = [...new Set(data.map((d) => d[field]))];
    if (field === "SampleTime") {
      colorScales[field] = (value) => sampleTimeColors[value] || "#ccc";
    } else if (field === "Rootstock") {
      colorScales[field] = d3.scaleOrdinal().domain(uniqueValues).range(rootstockColors);
    } else if (field === "Treatment") {
      colorScales[field] = d3.scaleOrdinal().domain(uniqueValues).range(treatmentColors);
    } else if (field === "Greenhouse") {
      colorScales[field] = d3.scaleOrdinal().domain(uniqueValues).range(greenhouseColors);
    } else if (field !== "Diagnosis") {
      colorScales[field] = d3.scaleOrdinal().domain(uniqueValues).range(d3.schemeCategory10);
    }
  });
  function getMetadataColor(field, value) {
    if (field === "Diagnosis" && diagnosisColors[value]) {
      return diagnosisColors[value];
    } else if (colorScales[field]) {
      return colorScales[field](value);
    }
    return "#ccc";
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css$1);
  return `<div class="outer-container svelte-1lropm6"><div class="content-container svelte-1lropm6"><div class="left-labels svelte-1lropm6"><div class="metadata-labels svelte-1lropm6">${each(metadataFields, (field) => {
    return `<div class="label svelte-1lropm6">${escape(field)}</div>`;
  })}</div> <div class="topic-labels svelte-1lropm6">${each(topics, (topic) => {
    return `<div class="label svelte-1lropm6">${escape(topic)}</div>`;
  })}</div></div> <div class="grid-container svelte-1lropm6"><div class="metadata-grid svelte-1lropm6">${each(metadataFields, (field) => {
    return `${each(data, (item) => {
      return `<div class="metadata-rect svelte-1lropm6" style="${"background-color: " + escape(getMetadataColor(field, item[field]), true)}"></div>`;
    })}`;
  })}</div> <div class="heatmap-grid svelte-1lropm6">${each(topics, (topic) => {
    return `${each(data, (item) => {
      return `<div class="rect svelte-1lropm6" style="${"background-color: " + escape(getColor(parseFloat(item[topic])), true)}"></div>`;
    })}`;
  })}</div></div></div> <div class="x-axis svelte-1lropm6">${each(data, (item) => {
    return `<div class="x-label svelte-1lropm6">${escape(item.averageID)}</div>`;
  })}</div></div>`;
});
const css = {
  code: ".heatmap-container.svelte-1uo8r5e{width:80vw;height:60vh;margin-top:15vh;margin-left:5vw;padding:10px;overflow-x:auto}svg.svelte-1uo8r5e{font-size:10px;padding-bottom:4vh}",
  map: `{"version":3,"file":"topic_9.svelte","sources":["topic_9.svelte"],"sourcesContent":["<script>\\n    import { onMount } from 'svelte';\\n    import * as d3 from 'd3';\\n    import { loadTopicData } from './dataLoader';  // Adjust the path to your dataLoader.js\\n  \\n    let data = [];\\n    let margin = { top: 20, right: 30, bottom: 50, left: 100 };\\n    let width = 800;\\n    let height = 700;\\n  \\n    onMount(async () => {\\n      data = await loadTopicData();\\n      drawHeatmap();\\n    });\\n  \\n    function drawHeatmap() {\\n  const container = d3.select('.heatmap-container').node();\\n  const containerWidth = container.clientWidth;\\n  const containerHeight = container.clientHeight;\\n\\n  // Adjust the width to be larger for wider rectangles and allow scrolling\\n  const adjustedWidth = containerWidth * 2; // Adjust width to twice the container's width (or another factor)\\n  const adjustedHeight = containerHeight - margin.top - margin.bottom;\\n\\n  const svg = d3.select('#heatmap')\\n    .attr('width', adjustedWidth + margin.left + margin.right)\\n    .attr('height', adjustedHeight + margin.top + margin.bottom)\\n    .append('g')\\n    .attr('transform', \`translate(\${margin.left},\${margin.top})\`);\\n\\n  const topics = Array.from(new Set(data.map(d => d.Topic)));\\n  let taxa = Array.from(new Set(data.map(d => d.Taxon)));  // We will modify this array on sorting\\n\\n  // Set xScale and yScale\\n  let xScale = d3.scaleBand()\\n    .domain(taxa)\\n    .range([0, adjustedWidth])\\n    .padding(0.05); // Wider cells\\n\\n  const yScale = d3.scaleBand()\\n    .domain(topics)\\n    .range([0, adjustedHeight])\\n    .padding(0.05);\\n\\n  const colorScale = d3.scaleSequential(d3.interpolateBlues)\\n    .domain([0, d3.max(data, d => d.logged_value)]);\\n\\n  // Function to update the heatmap when taxa are sorted\\n  function updateHeatmap(sortedTaxa) {\\n    xScale.domain(sortedTaxa);\\n\\n    // Update the rectangles\\n    svg.selectAll('rect')\\n      .data(data)\\n      .transition()\\n      .duration(750)\\n      .attr('x', d => xScale(d.Taxon));\\n\\n    // Update X axis\\n    svg.select('.x-axis')\\n      .transition()\\n      .duration(750)\\n      .call(d3.axisBottom(xScale))\\n      .selectAll('text')\\n      .attr('transform', 'rotate(45)')\\n      .style('text-anchor', 'start');\\n  }\\n\\n  // Render heatmap\\n  svg.append('g')\\n    .selectAll('rect')\\n    .data(data)\\n    .enter()\\n    .append('rect')\\n    .attr('x', d => xScale(d.Taxon))\\n    .attr('y', d => yScale(d.Topic))\\n    .attr('width', xScale.bandwidth())\\n    .attr('height', yScale.bandwidth())\\n    .attr('fill', d => colorScale(d.logged_value));\\n\\n  // X axis labels\\n  svg.append('g')\\n    .attr('class', 'x-axis')\\n    .attr('transform', \`translate(0,\${adjustedHeight})\`)\\n    .call(d3.axisBottom(xScale))\\n    .selectAll('text')\\n    .attr('transform', 'rotate(45)')\\n    .style('text-anchor', 'start');\\n\\n  // Y axis labels with click event for sorting\\n  svg.append('g')\\n    .call(d3.axisLeft(yScale))\\n    .selectAll('text')\\n    .style('font-size', '10px')\\n    .style('cursor', 'pointer')  // Make the labels clickable\\n    .on('click', (event, clickedTopic) => {\\n      // Sort taxa based on the clicked topic from largest to smallest\\n      const sortedTaxa = taxa.slice().sort((a, b) => {\\n        const valueA = data.find(d => d.Taxon === a && d.Topic === clickedTopic)?.logged_value || 0;\\n        const valueB = data.find(d => d.Taxon === b && d.Topic === clickedTopic)?.logged_value || 0;\\n        return valueB - valueA;  // Sort in descending order\\n      });\\n      \\n      // Update the heatmap with the sorted taxa\\n      updateHeatmap(sortedTaxa);\\n    });\\n\\n  // Add title\\n  svg.append('text')\\n    .attr('x', adjustedWidth / 2)\\n    .attr('y', -10)\\n    .attr('text-anchor', 'middle')\\n    .style('font-size', '16px')\\n    .text('Heatmap of Topics by Taxon');\\n}\\n<\/script>\\n  \\n  <div class=\\"heatmap-container\\">\\n    <svg id=\\"heatmap\\"></svg>\\n  </div>\\n  \\n  <style>\\n    .heatmap-container {\\n  width: 80vw;\\n  height: 60vh;\\n  margin-top: 15vh;\\n  margin-left: 5vw;\\n  padding: 10px;\\n  overflow-x: auto;  /* Enable horizontal scrolling */\\n}\\n  \\n    svg {\\n      font-size: 10px;\\n      padding-bottom: 4vh;\\n    }\\n  </style>"],"names":[],"mappings":"AA0HI,iCAAmB,CACrB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,CAChB,WAAW,CAAE,GAAG,CAChB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IACd,CAEI,kBAAI,CACF,SAAS,CAAE,IAAI,CACf,cAAc,CAAE,GAClB"}`
};
const Topic_9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="heatmap-container svelte-1uo8r5e" data-svelte-h="svelte-hlfbcq"><svg id="heatmap" class="svelte-1uo8r5e"></svg> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let topicdis = [];
  return `<main> ${topicdis.length > 0 ? `${validate_component(Heatmap_9, "Heatmap").$$render($$result, { data: topicdis }, {}, {})}` : ``}  ${validate_component(Topic_9, "Topicmap").$$render($$result, {}, {}, {})}</main>`;
});
export {
  Page as default
};
