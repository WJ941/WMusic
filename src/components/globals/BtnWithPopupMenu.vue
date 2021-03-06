<template>
  <div class="btn-with-popup-menu">
    <div ref="btn">
      <slot name="btn" />
    </div>
    <div
      class="btn-with-popup-menu__popup-menu"
      v-show="canPopup && showPopup"
      :style="styleObj"
      ref="popupMenu"
    >
      <slot name="menu" />
    </div>
  </div>
</template>

<script lang="ts">
/*
              top
        +-------------+
  left  |     more    |   right
        +-------------+
            bottom
*/
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import MoreItem from "@/components/more-list/MoreItem.vue";
import MoreList from "@/components/more-list/MoreList.vue";
import DownloadIcon from "@/components/SVGIcons/DownloadIcon.vue";
import MoreIcon from "@/components/SVGIcons/MoreIcon.vue";
import SvgBtn from "@/components/globals/SvgBtn.vue";
import { withIn } from "@/utilitys";

@Component({
  components: {
    MoreItem,
    MoreList,
    SvgBtn,
    MoreIcon,
    DownloadIcon
  }
})
export default class BtnWithPopupMenu extends Vue {
  @Prop(Boolean) disabled!: boolean;
  @Prop({ default: true, type: Boolean }) canPopup!: boolean;
  showPopup: boolean = false;
  styleObj: { top: string; bottom: string; right: string; left: string } = {
    top: "",
    bottom: "",
    right: "",
    left: ""
  };
  $refs!: {
    btn: Element;
    popupMenu: Element;
  };
  @Watch("canPopup")
  onChange(val: boolean) {
    this.showPopup = false;
  }
  calcPosition() {
    if (!this.$refs.btn) return;
    const {
      top,
      left,
      bottom,
      right,
      width,
      height
    } = this.$refs.btn.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight;
    const viewportWidth = document.documentElement.clientWidth;

    const topSpace = top;
    const bottomSpace = viewportHeight - top - height;
    const leftSpace = left;
    const rightSpace = viewportWidth - left - width;

    if (leftSpace >= rightSpace) {
      this.styleObj.right = `${Math.max(rightSpace + width, 0)}px`;
      this.styleObj.left = "";
    } else {
      this.styleObj.right = "";
      this.styleObj.left = `${leftSpace + width}px`;
    }
    if (topSpace >= bottomSpace) {
      this.styleObj.bottom = bottomSpace + height + "px";
    } else {
      this.styleObj.top = topSpace + height + "px";
    }
  }
  handleBtnClick(): void {
    // this.showPopup = !this.showPopup;
  }
  handleBodyClick(e: Event) {
    e.preventDefault();

    const target = e.target as HTMLElement;
    if (!e.target) {
      return;
    }
    if (withIn(target, this.$refs.btn)) {
      if (!this.disabled) {
        this.showPopup = !this.showPopup;
      }
    } else {
      this.showPopup = false;
    }
    return;
    // const target = e.target as HTMLElement;
    // if (!e.target) {
    //   return;
    // }
    // if (this.withIn(target, this.$refs.btn)) {
    //   if (!this.disabled) {
    //     this.showPopup = !this.showPopup;
    //   }
    // } else if (
    //   !this.withIn(target, this.$refs.btn) &&
    //   !this.withIn(target, this.$refs.popupMenu)
    // ) {
    //   this.showPopup = false;
    // }
  }
  handleBodyScroll(): void {
    this.showPopup = false;
  }
  mounted() {
    document.body.addEventListener("click", this.handleBodyClick);
    document.body.addEventListener("scroll", this.handleBodyScroll);
  }
  beforeDestroy() {
    document.body.removeEventListener("click", this.handleBodyClick);
    document.body.removeEventListener("scroll", this.handleBodyScroll);
  }
  @Watch("showPopup")
  onShowPopupChange(val: boolean) {
    if (val) {
      this.calcPosition();
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/style/theme.sass"
.btn-with-popup-menu
  &__popup-menu
    @include themify($themes)
      background-color: themed('background-color')
    position: fixed
    z-index: 99
</style>
