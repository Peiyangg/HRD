<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  export let data = [];

  // Define the fields for categorical data
  const metadataFields = ["Greenhouse", "SampleTime", "Diagnosis", "Treatment", "Rootstock", "Scion"];
  const topics = ["Topic_0", "Topic_1", "Topic_2", "Topic_3", "Topic_4", "Topic_5", "Topic_6", "Topic_7", "Topic_8"];
  const rootstockColors = ['#484C62', '#487E86', '#C3675D'];
  const sampleTimeColors = {
    1: '#eff3ff',
    2: '#bdd7e7',
    3: '#6baed6',
    4: '#3182bd',
    5: '#08519c'
  };

  const greenhouseColors = [
    'rgb(196, 216, 227)',  // Light Blue
    'rgb(105, 150, 180)',  // Dark Blue
    'rgb(200, 223, 180)',  // Light Green
    'rgb(105, 160, 101)',  // Dark Green
    'rgb(251, 202, 202)',  // Light Pink
    'rgb(227, 126, 127)',  // Red
    'rgb(253, 222, 182)',  // Light Orange
    'rgb(255, 191, 127)',  // Orange
    'rgb(207, 196, 214)',  // Lavender
    'rgb(130, 107, 154)',  // Purple
    'rgb(255, 255, 204)',  // Light Yellow
    'rgb(189, 144, 109)'   // Brown
  ];

  const diagnosisColors = {
    "infested": "rgb(150, 84, 84)",
    "healthy": "rgb(123, 139, 111)",
    "before": "rgb(244, 186, 175)"
  };

  const treatmentColors = [
    'rgb(228, 127, 128)',  // Red
    'rgb(119, 155, 184)',  // Blue
    'rgb(125, 175, 124)',  // Green
    'rgb(157, 120, 163)',  // Purple
    'rgb(255, 191, 127)',  // Orange
    'rgb(255, 255, 153)'   // Yellow
  ];

  

  // Color scale for continuous data (topics)
  function getColor(value) {
  // Start with off-white (e.g., rgb(255, 240, 240)) to red (rgb(255, 0, 0))
  const redScale = Math.floor(255 * value);  // Red channel increases with value
  const otherChannels = Math.floor(240 * (1 - value));  // Green and blue channels decrease

  return `rgb(255, ${otherChannels}, ${otherChannels})`;
}

  // Generate unique values for categorical data and create color scales using d3
  let colorScales = {};

  metadataFields.forEach((field) => {
    let uniqueValues = [...new Set(data.map(d => d[field]))];
    
    // Assign specific custom colors for 'SampleTime' values (1-5)
    if (field === 'SampleTime') {
      colorScales[field] = (value) => sampleTimeColors[value] || '#ccc';  // Assign custom colors or fallback
    } 
    // Custom colors for Rootstock
    else if (field === 'Rootstock') {
      colorScales[field] = d3.scaleOrdinal()
        .domain(uniqueValues)
        .range(rootstockColors);  // Apply custom colors for Rootstock
    } 
    // Custom colors for Treatment
    else if (field === 'Treatment') {
      colorScales[field] = d3.scaleOrdinal()
        .domain(uniqueValues)
        .range(treatmentColors);  // Use fixed colors for Treatment
    }
    // Custom colors for Greenhouse (fixed set)
    else if (field === 'Greenhouse') {
      colorScales[field] = d3.scaleOrdinal()
        .domain(uniqueValues)
        .range(greenhouseColors);  // Use fixed colors for Greenhouse
    } 
    else if (field !== 'Diagnosis') {
      // Use default d3.schemeCategory10 for other fields (except Diagnosis)
      colorScales[field] = d3.scaleOrdinal()
        .domain(uniqueValues)
        .range(d3.schemeCategory10); 
    }
  });

  // Function to get color for categorical data using D3's color scale or custom for Diagnosis
  function getMetadataColor(field, value) {
    if (field === "Diagnosis" && diagnosisColors[value]) {
      return diagnosisColors[value]; // Custom colors for Diagnosis values
    } else if (colorScales[field]) {
      return colorScales[field](value); // Use D3 color scales for other fields
    }
    return '#ccc'; // Fallback color if scale or custom color is not found
  }

  let selectedRect = null;
  let tooltip = null;
  let tooltipContent = '';

  let selectedItem = null;
  let selectedTopic = null;

  onMount(() => {
    tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  });

  function handleHover(item,topic) {
      selectedItem = item;
      selectedTopic=topic;


    // Prepare tooltip content
    tooltipContent = `
      <strong>Average ID:</strong> ${item.averageID}<br>
      <strong>${topic}:</strong> ${item[topic]}<br>
      <strong>Greenhouse:</strong> ${item.Greenhouse}<br>
      <strong>Sample Time:</strong> ${item.SampleTime}<br>
      <strong>Diagnosis:</strong> ${item.Diagnosis}<br>
      <strong>Treatment:</strong> ${item.Treatment}<br>
      <strong>Rootstock:</strong> ${item.Rootstock}<br>
      <strong>Scion:</strong> ${item.Scion}
    `;

    // Show tooltip
    tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    tooltip.html(tooltipContent)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  }

  function hideTooltip() {
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  }
</script>

<style>
  .outer-container {
    width: 80vw;
    height: 85vh;
    padding-top: 1vh ;
    margin-left: 5vw;
    position: relative;
    display: flex;
    flex-direction: column;

  }

  .content-container {
    display: flex;
    height: 80vh;
  }

  .left-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 10vw;
    padding-right: 10px;
  }

  .metadata-labels {
    height: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .topic-labels {
    height: 65vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 10px;
  }

  .label {
    font-size: 10px;
    text-align: right;
  }

  .grid-container {
    display: flex;
    flex-direction: column;
    width: 85vw;
  }

  .metadata-grid {
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: repeat(60, 1fr);
    gap: 1px;
    height: 20vh;
    margin-bottom: 1vh;
  }

  .metadata-rect {
    width: 100%;
    height: 100%;
  }

  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(60, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 1px;
    height: 65vh;
  }

  .rect {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .rect.selected {
    stroke: #000;
    stroke-width: 5px;
  }

  :global(.tooltip) {
    position: absolute;
    text-align: left;
    padding: 8px;
    font: 12px sans-serif;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    pointer-events: none;
  }

  .x-axis {
    height: 5vh;
    width: 85vw;
    margin-left: 9vw;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 8px;
    padding-top: 5px;
  }

  .x-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 100%;
    width: 1.09vw; /* Set the width to 1.41vw as requested */
    margin-right: 0.1vw; /* Adjust spacing between labels */

  }
</style>

<div class="outer-container">
  <div class="content-container">
    <div class="left-labels">
      <div class="metadata-labels">
        {#each metadataFields as field}
          <div class="label">{field}</div>
        {/each}
      </div>
      <div class="topic-labels">
        {#each topics as topic}
          <div class="label">{topic}</div>
        {/each}
      </div>
    </div>

    <div class="grid-container">
      <div class="metadata-grid">
        {#each metadataFields as field}
          {#each data as item}
            <div class="metadata-rect" style="background-color: {getMetadataColor(field, item[field])}"></div>
          {/each}
        {/each}
      </div>

      <div class="heatmap-grid">
        {#each topics as topic}
          {#each data as item}
            <div 
              class="rect" 
              style="background-color: {getColor(parseFloat(item[topic]))}"
              on:mouseenter={() => handleHover(item, topic)}
              on:mouseleave={hideTooltip}
            ></div>
          {/each}
        {/each}
      </div>
    </div>
  </div>

  <div class="x-axis">
    {#each data as item}
      <div class="x-label">{item.averageID}</div>
    {/each}
  </div>
</div>