<template>
  <div class="offical" v-if="content">
      <TabMenu :list="typeList" align-left />
      <div class="card">
        <div class="card__left">
          <ImageWithPlaceholder
            :src="content.picUrl | convert2Https | clipImage(400, 400)"
            :alt="content.title"
            ratio="1:1"
          />
        </div>
        <div class="card__right">
          <div class="track-head">
            <Button
              class="track-head__play"
              rounded
              primary
              xsmall
              @click.native="playAll"
            >全部播放</Button>
            <Button
              class="track-head__check"
              as="a"
              rounded
              xsmall
              :href="'/playlist/'+content.id"
            >查看全部</Button>
          </div>
          <ul class="table-body">
            <li class="track__item" v-for="(track, i) in content.tracks.slice(0, 5)" :key="track.id">
              <div class="track__rank__play">
                <span class="track__rank">0{{i+1}}</span>
                <span class="track__play" @click="play(track.id)"><PlayIcon /></span>
              </div>
              <router-link class="track__name ellipsis" :to="'/song/'+track.id">{{track.name}}</router-link>
              <span class="track__artists">
                <ArtistsWithComma :artists="track.artists" aTagClass="track__artist" />
              </span>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>
<script lang='ts'>
import { getTopList } from "@/service";
import ImageWithPlaceholder from '@/components/globals/ImageWithPlaceholder.vue';
import ArtistsWithComma from '@/components/globals/ArtistsWithComma.vue';
import TabMenu from '@/components/globals/TabMenu.vue';
import { DomesticTopList } from './MediaItem.vue';
import Button from '@/components/globals/Button.vue';
import { Mutation, namespace } from 'vuex-class';
import PlayIcon from '@/components/SVGIcons/PlayIcon.vue';
import {
  PlaylistType,
  Track,
  TrackServer,
  Album,
  TabMenuItem,
  Artist,
} from '@/types';
import {
  Vue,
  Component,
  Prop,
  Watch
} from 'vue-property-decorator';

const playlist = namespace('playlist');

interface Card {
  id: number;
  name: string;
  type: PlaylistType;
  picUrl: string;
}

// "0": "云音乐新歌榜", "1": "云音乐热歌榜", "2": "网易原创歌曲榜"
enum Type { New, Hot, Origin};
interface TopListType {
  id: number;
  name: string;
  picUrl: string;
  tracks: Track[];
}
interface OfficialConntent {
  id: number;
  title: string;
  picUrl: string;
  tracks: Track[];
}

@Component({
  components: {
    ImageWithPlaceholder,
    ArtistsWithComma,
    TabMenu,
    Button,
    PlayIcon,
  },
})
export default class OfficialTopList extends Vue {

  readonly officialTabTitles: {key: Type, title: string}[] =  [
    {key: Type.Hot, title: "热歌"},
    {key: Type.New, title: "新歌"},
    {key: Type.Origin, title: "原创"}
  ];
  selectedType: Type =  Type.Hot;

  get typeList(): TabMenuItem[] {
    return this.officialTabTitles.map((t: {key: Type, title: string}): TabMenuItem => ({
      key: t.key,
      isActive: this.selectedType == t.key,
      onClick: () => this.selectedType = t.key,
      title: t.title,
    }));
  }
  content: OfficialConntent | null = null;
  updateOfficial() {
    getTopList(this.selectedType).then(
      res => {
        const p = res.data.playlist;
        const tracks = p.tracks.map((t: TrackServer): Track => ({
          id: t.id,
          name: t.name,
          artists: t.ar,
          album: t.al,
          duration: t.dt
        }))
        this.content = {
          id: p.id,
          title: p.name,
          picUrl: p.coverImgUrl,
          tracks: tracks
        };
      }
    )
  }
  created() {
    this.updateOfficial();
  }
  @Watch('selectedType')
  onSelectedOfficialChange() {
    this.updateOfficial();
  }
  @playlist.Mutation setCurrentSongId!: (id: number) => void
  @playlist.Mutation setTracks!: (tracks: Track[]) => void
  playAll() {
    if (this.content && this.content.tracks) {
      const tracks = this.content.tracks;
      this.setCurrentSongId(tracks[0].id);
      this.setTracks(tracks);
    }
  }
  play(id: number) {
    if (this.content && this.content.tracks) {
      const tracks = this.content.tracks;
      this.setCurrentSongId(id);
      this.setTracks(tracks);
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/components/config.sass"
@import '@/style/colors.sass'

.offical
  background-color: #e8e8e8
  margin: 0 -2em
  padding: 2em

.card
  display: flex
  justify-content: space-between
  background-color: inherit
  margin-top: 1em
  color: #666
  img
    width: 200px
    height: 200px
    // transform: rotate3d(0, 1, 0, 45deg)
.card__left
  flex: 0 0 13em
  margin-right: 1.3em
.card__right
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: flex-start
.track-head, .track__item
  display: flex
  flex-direction: row
  jusitfy-content: flex-start
  align-items: center
  padding: 0.5em 1em
  border-radius: 9999px

.track-head
  font-size: 14px
.track-head__play
  flex: 0 0 auto
  margin-right: 2em
  color: inherit
.track-head__check
  flex: 0 0 auto

.table-body
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: space-between
.track__item
  transition: all 250ms
  &:hover
    background: #e0e0e0
.track__rank__play
  flex: 0 0 2em
  box-sizing: border-box
  overflow: hidden
  margin: -0.25em
  .track__play
    display: none
    width: 1em
    padding: 0.25em
    cursor: pointer
    color: $primary
    transition: all 250ms
    border-radius: 9999px
    &:hover
      background: $primary
      color: #fff

.track__item:hover
  .track__play
    display: flex
  .track__rank
    display: none

.track__name
  flex: 1 1 0
  margin-right: 1em
.track__artists
  flex: 1 1 0

.track__name, .track__artist
  transition: all 250ms
  &:hover
    color: #000

.others
  margin-top: 40px
.ellipsis
	white-space: nowrap
	overflow: hidden
	text-overflow: ellipsis

</style>
