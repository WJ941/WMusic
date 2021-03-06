// client is same as server
export interface Artist {
  id: number;
  name: string;
  alias?: string[];
  picUrl?: string;
}

export interface User {
  userId: number;
  nickname: string;
  avatarUrl: string;
}

// client is same as server
export interface Album {
  id: number;
  name: string;
  picUrl: string;
}

// client is same as server
export interface TrackQuality {
  br: number;
  fid: number;
  size: number;
  vd: number;
}
export interface Track {
  id: number;
  name: string;
  artists: Artist[];
  album: Album;
  duration: number;
  high?: TrackQuality;
  middle?: TrackQuality;
  low?: TrackQuality;
  mvId?: number;
  status: number;
}
export function convertTrack(trackServer: TrackServer): Track {
  const { id, name, ar, al, dt, h, l, m, mv, st } = trackServer;
  return {
    id,
    name,
    artists: ar,
    album: al,
    duration: dt,
    high: h,
    middle: m,
    low: l,
    mvId: mv,
    status: st
  };
}
export interface TrackServer {
  id: number;
  name: string;
  ar: Artist[];
  al: Album;
  dt: number;
  h: TrackQuality;
  l: TrackQuality;
  m: TrackQuality;
  mv: number;
  st: number;
}
export interface PlaylistCreator {
  userId: number;
  nickname: string;
}

export type PlaylistType = "playlist" | "album";
export interface Playlist {
  id: number;
  picUrl: string;
  name: string;
  playCount: number;
  creator: PlaylistCreator;
}

// export interface PlaylistDetail

export interface Comment {
  commentId: number;
  user: User;
  time: number;
  content: string;
  likedCount: number;
  beReplied: RepliedComment[];
}
interface RepliedComment {
  beRepliedCommentId: number;
  content: string;
  user: User;
}

// 0 : mv comment 1: song comment
/**
0: 歌曲

1: mv

2: 歌单

3: 专辑

4: 电台

5: 视频

6: 动态
 */
export enum CommentType {
  SongComment,
  MvComment,
  PlaylistComment,
  AlbumComment
}

export interface ControlBtn {
  onClick: () => void;
}
export interface Rank {
  id: number;
  cover: string;
  name: string;
  artistName: string;
  artistId: number;
  briefDesc: string;
  rank: number;
  lastRank: number;
  playCount: number;
}

export interface MvCard {
  id: number;
  cover: string;
  name: string;
  artists: { id: number; name: string }[];
}

export interface MvType {
  cover: string;
  name: string;
  id: number;
  artistName: string;
  artistId: string;
  playCount: number;
}

export interface Record {
  playCount: number;
  score: number;
  song: Track;
}
export interface TabMenuItem {
  key: number;
  title: string;
  isActive?: boolean; // if isLink is true, this no need
  onClick?: () => any; // if isLink is true, this no need
  isLink?: boolean;
  href?: string; // if isLink is true, this need
}

export enum PlayMode {
  Loop,
  OneLoop,
  Shuffle
}
export interface Br {
  [index: number]: string;
}
export interface Mv {
  id: number;
  name: string;
  artists: Artist[];
  cover: string;
  playCount: number;
  subCount: number;
  shareCount: number;
  likeCount: number;
  commentCount: number;
  duration: number;
  brs: Br[];
}
export interface Option {
  key: number;
  title: string;
  value: any;
}
export enum Theme {
  Light,
  Dark
}
export enum MediaCardType {
  Playlist = "playlist",
  Mv = "mvplay",
  Album = "album",
  djRadio = "djradio"
}
export interface MediaCardItem {
  type: MediaCardType;
  picUrl: string;
  title: string;
  id: number;
  subTitle?: string;
  subLink?: string;
  playCount?: number;
  ratio?: string;
}
export function mapPlaylistToCardItem(
  pl: Playlist,
  type: MediaCardType
): MediaCardItem {
  return {
    type: type,
    picUrl: pl.picUrl,
    title: pl.name,
    id: pl.id,
    subTitle: pl.creator && pl.creator.nickname,
    subLink: pl.creator && `/user/${pl.creator.userId}`,
    playCount: pl.playCount
  };
}
