<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { loadTopicData } from './dataLoader';  // Adjust the path to your dataLoader.js
  
    let data = [];
    let margin = { top: 20, right: 30, bottom: 50, left: 100 };
    let width = 800;
    let height = 700;
  
    onMount(async () => {
      data = await loadTopicData();
      drawHeatmap();
    });
  
    function drawHeatmap() {
  const container = d3.select('.heatmap-container').node();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Adjust the width to be larger for wider rectangles and allow scrolling
  const adjustedWidth = containerWidth * 2; // Adjust width to twice the container's width (or another factor)
  const adjustedHeight = containerHeight - margin.top - margin.bottom;

  const svg = d3.select('#heatmap')
    .attr('width', adjustedWidth + margin.left + margin.right)
    .attr('height', adjustedHeight + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const topics = Array.from(new Set(data.map(d => d.Topic)));
  let taxa = Array.from(new Set(data.map(d => d.Taxon)));  // We will modify this array on sorting

  // Set xScale and yScale
  let xScale = d3.scaleBand()
    .domain(taxa)
    .range([0, adjustedWidth])
    .padding(0.05); // Wider cells

  const yScale = d3.scaleBand()
    .domain(topics)
    .range([0, adjustedHeight])
    .padding(0.05);

  const colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data, d => d.logged_value)]);

  // Function to update the heatmap when taxa are sorted
  function updateHeatmap(sortedTaxa) {
    xScale.domain(sortedTaxa);

    // Update the rectangles
    svg.selectAll('rect')
      .data(data)
      .transition()
      .duration(750)
      .attr('x', d => xScale(d.Taxon));

    // Update X axis
    svg.select('.x-axis')
      .transition()
      .duration(750)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');
  }

  // Render heatmap
  svg.append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.Taxon))
    .attr('y', d => yScale(d.Topic))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(d.logged_value));

  // X axis labels
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${adjustedHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'rotate(45)')
    .style('text-anchor', 'start');

  // Y axis labels with click event for sorting
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .style('font-size', '10px')
    .style('cursor', 'pointer')  // Make the labels clickable
    .on('click', (event, clickedTopic) => {
      // Sort taxa based on the clicked topic from largest to smallest
      const sortedTaxa = taxa.slice().sort((a, b) => {
        const valueA = data.find(d => d.Taxon === a && d.Topic === clickedTopic)?.logged_value || 0;
        const valueB = data.find(d => d.Taxon === b && d.Topic === clickedTopic)?.logged_value || 0;
        return valueB - valueA;  // Sort in descending order
      });
      
      // Update the heatmap with the sorted taxa
      updateHeatmap(sortedTaxa);
    });

  // Add title
  svg.append('text')
    .attr('x', adjustedWidth / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Heatmap of Topics by Taxon');
}
</script>
  
  <div class="heatmap-container">
    <svg id="heatmap"></svg>
  </div>
  
  <style>
    .heatmap-container {
  width: 80vw;
  height: 60vh;
  margin-top: 15vh;
  margin-left: 5vw;
  padding: 10px;
  overflow-x: auto;  /* Enable horizontal scrolling */
}
  
    svg {
      font-size: 10px;
      padding-bottom: 4vh;
    }
  </style>