import fs from 'fs';

async function run() {
  const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent('Tamil songs')}&media=music&limit=5&country=IN`);
  const data = await res.json();
  console.log(data.results.map(r => r.trackName));
}
run();
