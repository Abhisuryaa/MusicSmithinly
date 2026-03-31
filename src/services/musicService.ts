import { Track } from '../data/mockData';

export async function searchTracks(query: string, country: string = 'US'): Promise<Track[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20&country=${country}`
    );
    const data = await response.json();

    return data.results
      .filter((item: any) => item.previewUrl)
      .map((item: any) => ({
        id: item.trackId.toString(),
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || 'Unknown Album',
        coverUrl: item.artworkUrl100.replace('100x100bb', '600x600bb'),
        duration: formatDuration(item.trackTimeMillis),
        audioUrl: item.previewUrl,
      }));
  } catch (error) {
    console.error('Error searching iTunes:', error);
    return [];
  }
}

export async function getRegionalHits(language: string = 'Hindi'): Promise<Track[]> {
  let searchTerm = language;
  
  if (language?.toLowerCase() === 'hindi') {
    searchTerm = 'bollywood';
  } else if (language?.toLowerCase() === 'tamil') {
    searchTerm = 'tamil';
  } else if (language?.toLowerCase() === 'telugu') {
    searchTerm = 'telugu';
  } else if (language?.toLowerCase() === 'malayalam') {
    searchTerm = 'malayalam';
  } else if (language?.toLowerCase() === 'punjabi') {
    searchTerm = 'punjabi';
  } else if (language?.toLowerCase() === 'kannada') {
    searchTerm = 'kannada';
  }

  return searchTracks(searchTerm, 'IN');
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
