export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  audioUrl: string;
  language?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers: string;
}

const covers = [
  "https://picsum.photos/seed/music1/500/500",
  "https://picsum.photos/seed/music2/500/500",
  "https://picsum.photos/seed/music3/500/500",
  "https://picsum.photos/seed/music4/500/500",
  "https://picsum.photos/seed/music5/500/500",
  "https://picsum.photos/seed/music6/500/500",
];

export const mockTracks: Track[] = [
  { id: "1", title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", coverUrl: "https://picsum.photos/seed/tumhiho/500/500", duration: "4:22", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/61/1d/3f/611d3f53-8d7b-8455-c66a-af21f28db1cb/mzaf_3524364971696240598.plus.aac.p.m4a", language: "Hindi" },
  { id: "2", title: "Channa Mereya", artist: "Arijit Singh", album: "Ae Dil Hai Mushkil", coverUrl: "https://picsum.photos/seed/channa/500/500", duration: "4:49", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a", language: "Hindi" },
  { id: "3", title: "Kun Faya Kun", artist: "A.R. Rahman", album: "Rockstar", coverUrl: "https://picsum.photos/seed/kunfaya/500/500", duration: "7:53", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2e/99/e2/2e99e2ff-1d1b-615c-9d87-1cd3b122ad7f/mzaf_4773314624008046164.plus.aac.p.m4a", language: "Hindi" },
  { id: "4", title: "Kabira", artist: "Tochi Raina, Rekha Bhardwaj", album: "Yeh Jawaani Hai Deewani", coverUrl: "https://picsum.photos/seed/kabira/500/500", duration: "3:43", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/97/55/80/975580d0-1905-268e-bdd0-32c3cdcd5ec9/mzaf_8346202279202239168.plus.aac.p.m4a", language: "Hindi" },
  { id: "5", title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh", album: "Tamasha", coverUrl: "https://picsum.photos/seed/agartum/500/500", duration: "5:41", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/b1/ef/60/b1ef60e4-edb1-9c6c-831c-63156a648460/mzaf_1954453039481622269.plus.aac.p.m4a", language: "Hindi" },
  { id: "6", title: "Raabta", artist: "Arijit Singh", album: "Agent Vinod", coverUrl: "https://picsum.photos/seed/raabta/500/500", duration: "4:04", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cf/d5/89/cfd58953-1cce-9177-e246-afcc841dc2c8/mzaf_4550324537914610520.plus.aac.p.m4a", language: "Hindi" },
  { id: "7", title: "Aalaporan Thamizhan", artist: "A.R. Rahman", album: "Mersal", coverUrl: "https://picsum.photos/seed/mersal/500/500", duration: "5:48", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2e/99/e2/2e99e2ff-1d1b-615c-9d87-1cd3b122ad7f/mzaf_4773314624008046164.plus.aac.p.m4a", language: "Tamil" },
  { id: "8", title: "Rowdy Baby", artist: "Dhanush, Dhee", album: "Maari 2", coverUrl: "https://picsum.photos/seed/maari2/500/500", duration: "4:44", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/b1/ef/60/b1ef60e4-edb1-9c6c-831c-63156a648460/mzaf_1954453039481622269.plus.aac.p.m4a", language: "Tamil" },
  { id: "9", title: "Butta Bomma", artist: "Armaan Malik", album: "Ala Vaikunthapurramuloo", coverUrl: "https://picsum.photos/seed/buttabomma/500/500", duration: "3:18", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/97/55/80/975580d0-1905-268e-bdd0-32c3cdcd5ec9/mzaf_8346202279202239168.plus.aac.p.m4a", language: "Telugu" },
  { id: "10", title: "Shape of You", artist: "Ed Sheeran", album: "Divide", coverUrl: "https://picsum.photos/seed/shapeofyou/500/500", duration: "3:53", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/61/1d/3f/611d3f53-8d7b-8455-c66a-af21f28db1cb/mzaf_3524364971696240598.plus.aac.p.m4a", language: "English" },
  { id: "11", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", coverUrl: "https://picsum.photos/seed/blindinglights/500/500", duration: "3:20", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cf/d5/89/cfd58953-1cce-9177-e246-afcc841dc2c8/mzaf_4550324537914610520.plus.aac.p.m4a", language: "English" },
  { id: "12", title: "Jimikki Kammal", artist: "Vineeth Sreenivasan", album: "Velipadinte Pusthakam", coverUrl: "https://picsum.photos/seed/jimikki/500/500", duration: "3:18", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2e/99/e2/2e99e2ff-1d1b-615c-9d87-1cd3b122ad7f/mzaf_4773314624008046164.plus.aac.p.m4a", language: "Malayalam" },
  { id: "13", title: "Brown Munde", artist: "AP Dhillon", album: "Brown Munde", coverUrl: "https://picsum.photos/seed/brownmunde/500/500", duration: "4:27", audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d5/f9/98/d5f998a7-0090-ee2d-03f8-557ad6c5bf65/mzaf_14251357991592637728.plus.aac.p.m4a", language: "Punjabi" }
];

export const mockArtists: Artist[] = [
  { id: "a1", name: "Arijit Singh", imageUrl: "https://picsum.photos/seed/arijit/500/500", followers: "95M" },
  { id: "a2", name: "A.R. Rahman", imageUrl: "https://picsum.photos/seed/rahman/500/500", followers: "45M" },
  { id: "a3", name: "The Weeknd", imageUrl: "https://picsum.photos/seed/weeknd/500/500", followers: "84M" },
  { id: "a4", name: "Dua Lipa", imageUrl: "https://picsum.photos/seed/dua/500/500", followers: "62M" },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "p1",
    title: "Bollywood Hits",
    description: "The hottest tracks from the heart of Indian cinema.",
    coverUrl: "https://picsum.photos/seed/bollywood/500/500",
    tracks: mockTracks.slice(0, 4),
  },
  {
    id: "p2",
    title: "Cyberpunk Vibes",
    description: "The ultimate synthwave collection for late night coding.",
    coverUrl: covers[0],
    tracks: mockTracks.slice(2, 6),
  },
];

export const languages = [
  { id: "l1", name: "Hindi", color: "from-orange-500 to-red-500" },
  { id: "l2", name: "Tamil", color: "from-purple-500 to-indigo-500" },
  { id: "l3", name: "English", color: "from-blue-500 to-cyan-500" },
  { id: "l4", name: "Telugu", color: "from-pink-500 to-rose-500" },
  { id: "l5", name: "Malayalam", color: "from-emerald-500 to-teal-500" },
  { id: "l6", name: "Punjabi", color: "from-amber-500 to-yellow-500" },
];
