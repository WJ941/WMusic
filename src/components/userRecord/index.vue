<template>
  <div class="user-record">
    <TabMenu align-left :list="navTabList" />
    <ul class="record-list__container">
      <RecordItem
        v-for="r in records"
        :key="r.song.id"
        :record="r"
        @play="handlePlay"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { getRecord } from "@/service";
import { mapState, mapMutations } from "vuex";
import TabMenu from "@/components/globals/TabMenu.vue";
import RecordItem from "./RecordItem.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Track,
  TrackQuality,
  Record,
  Artist,
  Album,
  convertTrack,
  TrackServer
} from "@/types";
import { Mutation, namespace } from "vuex-class";

// 0 时返回 allData, 1 时只返回 weekData
enum DataType {
  AllData,
  WeekData
}

const playlist = namespace("playlist");
const notification = namespace("notification");

@Component({
  components: { TabMenu, RecordItem }
})
export default class UserRecord extends Vue {
  type: DataType = DataType.WeekData;

  records: Record[] | null = null;
  @playlist.Mutation setTracks!: (tracks: Track[]) => void;
  @notification.Mutation setMsg!: (msg: string) => void;
  get navTabList() {
    return [
      {
        key: 0,
        isActive: this.type == DataType.WeekData,
        onClick: () => (this.type = 1),
        title: "一周"
      },
      {
        key: 1,
        isActive: this.type == DataType.AllData,
        onClick: () => (this.type = 0),
        title: "所有"
      }
    ];
  }

  @Watch("type")
  onTypeChange() {
    this.updateRecords();
  }

  mounted() {
    this.updateRecords();
  }

  updateRecords() {
    const userId = Number(this.$route.params.id);
    if (!userId) return;
    getRecord(userId, this.type).then(
      res => {
        let data;
        if (this.type == DataType.WeekData) {
          data = res.data.weekData;
        }
        if (this.type == DataType.AllData) {
          data = res.data.allData;
        }
        if (data) {
          this.records = data.map(
            (r: {
              song: TrackServer;
              playCount: number;
              score: number;
            }): Record => ({
              playCount: r.playCount,
              score: r.score,
              song: convertTrack(r.song)
            })
          );
        }
      },
      error => {
        this.setMsg(
          `获取用户播放记录错误！${error && error.msg ? error.msg : ""}`
        );
      }
    );
  }

  handlePlay() {
    if (this.records) {
      this.setTracks(this.records.map(r => r.song));
    }
  }
}
</script>

<style lang="sass" scoped>
.user-record
  padding: 1em
.record-list__container
  padding: 2em 0
  margin: 0 auto
</style>
