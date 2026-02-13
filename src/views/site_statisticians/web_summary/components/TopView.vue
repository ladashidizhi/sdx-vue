<template>
  <div style="width: calc(100% - 32px) ;flex-direction: column;padding: 0px 16px 0px 16px;">
    <a-space direction="vertical" style="width: 100%" size="medium">
      <div style="width: 100%;display: flex;justify-content: space-between">
        <span style="color: var(--color-text-2);">{{title}}</span>
        <div>
          <span style="color: var(--color-text-2);margin-right: 40px;">浏览量(PV)</span>
          <span style="color: var(--color-text-2);margin-right: 16px;width: 60px;">占比</span>
        </div>
      </div>
      <div
        style="width: 100%;display: flex;justify-content: space-between"
        v-for="(model,index) of modelList"
        :key="index"
      >
        <span v-if="!isType" style="color: var(--color-text-1);">{{model.name}}</span>
        <div
          v-else
          :style="{ color: isHover===index ? '' : '#168cff' ,cursor: 'pointer'}"
          @mouseover="changeColor(true,index)"
          @mouseleave="changeColor(false,index)"
          @click="openUrl(model.name)"
        >{{model.name}}</div>
        <div style="width: 130px;display: flex;justify-content:right;">
          <span style="color: var(--color-text-1);margin-right: 12px;">{{model.pv}}</span>
          <span
            style="color: var(--color-text-1);margin-right: 16px;width: 60px;display: flex;justify-content:right;"
          >{{model.proportion}}%</span>
        </div>
      </div>
    </a-space>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    title: "",
    modelList: Array,
    isType: false,
  },
  setup() {
    return {
      isHover: ref(-1),
    };
  },
  methods: {
    openUrl(url) {
      window.open(url);
    },
    changeColor(isHover, index) {
      if (isHover) {
        this.isHover = index;
      } else {
        this.isHover = -1;
      }
    },
  },
};
</script>