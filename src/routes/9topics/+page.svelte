<script>
	import { onMount } from 'svelte';
	import Heatmap from './heatmap_9.svelte'; // Use Heatmap component for both visualizations
	import Topicmap from './topic_9.svelte';
	import { loadData, loadTopicData } from './dataLoader.js'; // Loaders for both datasets
	
	let topicdis = [];
	let worddis = [];
  
	// Load both datasets when the component mounts
	onMount(async () => {
	  topicdis = await loadData(); // Load topic distribution data
	  worddis = await loadTopicData(); // Load word distribution data
	});
  </script>
  
  <main>
	<a href="/">Back to Menu</a>
	<h2>Topic Distribution</h2>
	<Heatmap data={topicdis} />
	<h2>ASV weights</h2>
	<Topicmap />
  </main> 