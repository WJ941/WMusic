import Api from "./Api";
import { CommentType } from "@/types";
import { isUndef } from "@/utilitys";

export interface CancelablePromise {
  promise: Promise<any>;
  cancel: () => void;
}

export function makeAxisoCancelable(
  requestPromise: Promise<any>
): CancelablePromise {
  let isCanceled = false;
  const p = new Promise((resolve, reject) => {
    requestPromise.then(
      (res: any) => (isCanceled ? reject("canceled") : resolve(res)),
      (error: any) => (isCanceled ? reject("canceled") : reject(error))
    );
  });
  function cancel() {
    isCanceled = true;
  }
  return {
    promise: p,
    cancel: cancel
  };
}

/**
 * 获取轮播图图片
 */
export function getBanner() {
  return Api().get("banner");
}
/**
 * 获取歌曲的播放地址
 * @param {Number} songId 歌曲ID
 */
export function getSongURL(songId: number) {
  return Api().get(`song/url?id=${songId}`);
}
/**
 * 获取歌曲信息
 * @param {Number} songId 歌曲ID
 */
export function getSongDetail(songId: number) {
  return Api().get(`/song/detail?ids=${songId}`);
}
/**
 * 获取推荐歌单
 */
export function getRecommendSongList() {
  return Api().get("/personalized");
}
/**
 * 获取歌单详情
 * @param {Number} playlistId 歌单ID
 */
export function getPlaylistDetail(playlistId: number) {
  return Api().get(`/playlist/detail?id=${playlistId}`);
}
/**
 * 获取歌手描述
 * @param {Number} artistId 歌手ID
 */
export function getArtistDesc(artistId: number) {
  return Api().get(`/artist/desc?id=${artistId}`);
}
/**
 * 获取歌手信息
 * @param {Number} artistId 歌手ID
 */
export function getArtistInfo(artistId: number) {
  return Api().get(`/artists?id=${artistId}`);
}
/**
 * 获取歌手的专辑
 * @param {Number} artistId 歌手ID
 */
export function getArtistAlbums(artistId: number) {
  return Api().get(`/artist/album?id=${artistId}`);
}
/**
 * 获取专辑详情
 * @param {Number} albumId 专辑ID
 */
export function getAlbumDetail(albumId: number) {
  return Api().get(`/album?id=${albumId}`);
}
/**
 * 获取歌单分类
 */
export function getPlayListCatlist() {
  return Api().get("/playlist/catlist");
}
/**
 * 获取歌单（网友精选碟）
 * @param {String} cat 歌单风格
 * @param {String} order 歌单类型：hot|new
 * @param {Number} offset 偏移数量
 */
export function getPlayList(
  cat: string = "全部",
  order: "hot" | "new" = "hot",
  offset: number = 0
) {
  return Api().get(
    `/top/playlist?limit=20&cat=${cat}&order=${order}&offset=${offset}`
  );
}
/**
 * 获取排行榜
 * @param {Number} idx 排行榜类型
 */
export function getTopList(idx: number) {
  return Api().get(`/top/list?idx=${idx}`);
}
/**
 * 获取最新MV
 */
export function getNewMV() {
  return Api().get("/mv/first");
}
/**
 * 获取推荐MV
 */
export function getPersonalizedMV() {
  return Api().get("/personalized/mv?limit=6");
}
/**
 * 获取MV数据
 * @param {Number} id MV ID
 */
export function getMvData(id: number) {
  return Api().get(`/mv/detail/?mvid=${id}`);
}
/**
 * 获取相似MV
 * @param {Number} id MV ID
 */
export function getSimilarMV(id: number) {
  return Api().get(`/simi/mv?mvid=${id}`);
}
/**
 * 获取MV排行榜
 * @param {Number} limit 偏移数量
 */
export function getMVrank(limit: number = 10) {
  const params = { limit };
  return Api().get("top/mv", { params });
}
/**
 * 获取歌词
 * @param {Number} id 歌曲ID
 */
export function getLyrics(id: number) {
  return Api().get(`/lyric?id=${id}`);
}
/**
 * 搜索
 * @param {String} keywords 关键词
 * @param {Number} type 搜索类型
 * @param {Number} limit 返回数量
 * @param {Number} offset 偏移数量
 */
export function search(
  keywords: string,
  type: number = 1,
  offset: number = 0,
  limit: number = 30
) {
  return Api().get(
    `/search?keywords=${keywords}&type=${type}&limit=${limit}&offset=${offset}`
  );
}
/**
 * 搜索建议
 * @param {String} keywords 关键字
 */
export function searchSuggest(keywords: string) {
  return Api().get(`/search/suggest?keywords=${keywords}`);
}
/**
 * 获取相似歌曲
 * @param {Number} songId
 */
export function getSimiSongs(songId: number) {
  return Api().get(`/simi/song?id=${songId}`);
}
/**
 * 获取用户详情
 * @param {Number} uid 用户id
 */
export function getUserDetail(uid: number) {
  return Api().get("/user/detail", { params: { uid } });
}
/**
 * 获取用户的歌单
 * @param {Number} uid 用户id
 */
export function getUserPlaylist(uid: number, offset: number = 0) {
  if (isUndef(uid)) {
    return Promise.reject("uid为空");
  }
  return Api().get("/user/playlist", { params: { uid, offset } });
}
/**
 * 邮箱登录
 * @param {String} email 邮箱地址
 * @param {String} password 密码
 */
export function loginEmail(email: string, password: string) {
  return Api().get(`/login?email=${email}&password=${password}`, {
    withCredentials: true
  });
}
/**
 * 手机登录
 * @param {Number} phone 手机号码
 * @param {String} password 密码
 * @param {Number} countrycode 国家码
 */
export function loginPhone(
  phone: number,
  password: string,
  countrycode: number
) {
  if (isUndef(phone) || isUndef(password) || isUndef(countrycode))
    return Promise.reject();
  const params = { phone, password, countrycode };
  return Api().get("/login/cellphone", { withCredentials: true, params });
}
export function logout() {
  return Api().get("/logout");
}
/**
 * 登陆后调用此接口 , 传入用户 id, 可获取用户播放记录
 * @param {Number} uid 用户 id
 * @param {Number} type type=1 时只返回 weekData, type=0 时返回 allData
 */
export function getRecord(uid: number, type: 0 | 1) {
  if (isUndef(uid)) return Promise.reject();
  return Api().get("/user/record", {
    withCredentials: true,
    params: { uid, type }
  });
}
/**
 * 调用此接口 , 传入用户 id, 可获取已喜欢音乐id列表(id数组)
 * @param {Number} uid 用户 id
 */
export function getLikelist(uid: number) {
  return Api().get(`/likelist?uid=${uid}`, { withCredentials: true });
}
/**
 * 登陆后调用此接口 , 传入用户 id, 可以获取用户关注列表
 * @param {Number} uid 用户 id
 * @param {Number} limit 返回数量 , 默认为 30
 * @param {Number} offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFollows(uid: number, offset: number, limit: number) {
  return Api().get(`/user/follows?uid=${uid}&offset=${offset}&limit=${limit}`);
}
/**
 * 登陆后调用此接口 , 传入用户 id, 可以获取用户粉丝列表
 * @param {Number} uid 用户 id
 * @param {Number} limit 返回数量 , 默认为 30
 * @param {Number} offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFolloweds(uid: number, offset: number, limit: number) {
  return Api().get(
    `/user/followeds?uid=${uid}&offset=${offset}&limit=${limit}`
  );
}
/**
 * 登陆后调用此接口 , 传入相关信息,可以更新用户信息
 */
export function userUpdate(
  nickname: string,
  signature: string,
  gender: 0 | 1 | 2,
  birthday: number,
  province: number,
  city: number
) {
  const params = {
    nickname,
    signature,
    gender,
    birthday,
    province,
    city
  };
  return Api().get("/user/update/?", { params, withCredentials: true });
}

/**
 * 调用此接口 , 可获得已收藏专辑列表
 * @param {Number} offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
 * @param {Number} limit 取出数量 , 默认为 25
 */
export function getAlbumSublist(offset = 0, limit = 25) {
  const params = { offset, limit };
  return Api().get("/album/sublist", { params, withCredentials: true });
}
/**
 * 调用此接口 , 可获得已收藏的歌手列表
 * @param {Number} offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
 * @param {Number} limit 取出数量 , 默认为 25
 */
export function getArtistSublist(offset = 0, limit = 25) {
  const params = { offset, limit };
  return Api().get("/artist/sublist", { params, withCredentials: true });
}
/**
 * 调用此接口 , 可获得已收藏的MV列表
 * @param {Number} offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
 * @param {Number} limit 取出数量 , 默认为 25
 */
export function getMvSublist(offset: number = 0, limit: number = 25) {
  const params = { offset, limit };
  return Api().get("/mv/sublist", { params, withCredentials: true });
}
/**
 * 调用此接口,可获取登录状态
 */
export function getLoginStatus() {
  return Api().get("/login/status", { withCredentials: true });
}
/**
 * 调用此接口 , 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
 * @param {number} playlistId id : 歌单 id
 * @param {number} type : 类型,1: 收藏, 2: 取消收藏
 */
export function subPlaylist(playlistId: number, type: 1 | 2) {
  return Api().get("/playlist/subscribe", {
    withCredentials: true,
    params: { id: playlistId, t: type }
  });
}

/**
 * 调用此接口 , 传入歌单 id 可获取歌单的所有收藏者
 */
export function getPlaylistSubers(
  id: number,
  offset: number = 0,
  limit: number = 30
) {
  const params = { id, offset, limit };
  return Api().get("/playlist/subscribers", { params });
}
/**
 * 获取歌曲评论
 * @param {Number} songId 歌曲ID
 * @param {Number} offset 偏移数量
 */
export function getSongComment(songId: number, offset: number) {
  return Api().get(`/comment/music?id=${songId}&limit=20&offset=${offset}`);
}
/**
 * 获取MV评论
 * @param {Number} id MV ID
 */
export function getMVComments(id: number, offset: number) {
  return Api().get(`/comment/mv?id=${id}&limit=20&offset=${offset}`);
}
/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该歌单的所有评论 ( 不需要 登录 )
 */
export function getPlaylistComments(
  id: number,
  offset: number = 0,
  limit: number = 20
) {
  const params = { id, offset, limit };
  return Api().get("comment/playlist", { params });
}
/**
 * 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该专辑的所有评论 ( 不需要 登录 )
 */
export function getAlbumComments(
  id: number,
  offset: number = 0,
  limit: number = 20
) {
  const params = { id, offset, limit };
  return Api().get("/comment/album", { params });
}
/**
 *  调用此接口,可发送评论评论
 *  @param {Number} id 对应资源 id
 *  @param {CommentType} type 资源类型 0: 歌曲，1: mv，2: 歌单，3: 专辑，4: 电台，5: 视频，6: 动态
 *  @param {string} content 评论内容
 */
export function sentComment(id: number, type: CommentType, content: string) {
  const params = { t: 1, id, type, content };
  return Api().get("/comment", { withCredentials: true, params });
}
/**
 *  调用此接口,可删除评论
 *  @param {Number} id 对应资源 id
 *  @param {CommentType} type 资源类型 0: 歌曲，1: mv，2: 歌单，3: 专辑，4: 电台，5: 视频，6: 动态
 *  @param {number} commentId 1: 发送, 0: 删除
 */
export function deleteComment(
  id: number,
  type: CommentType,
  commentId: number
) {
  const params = { t: 0, id, type, commentId };
  return Api().get("/comment", { withCredentials: true, params });
}

export function addToPlaylist(playlistId: number, trackId: number | number[]) {
  const trackIds = typeof trackId === "number" ? [trackId] : trackId;
  const params = { op: "add", pid: playlistId, tracks: trackIds.join(",") };
  return Api().get("/playlist/tracks", { withCredentials: true, params });
}
