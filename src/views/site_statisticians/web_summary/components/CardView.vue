<template>
  <a-card class="card-demo" :bordered="false" hoverable>
    <template #title>
      <h3 style="font-size:14px;">{{title}}</h3>
    </template>
    <template #extra>
      <icon-right-circle
        v-if="isShows"
        :style="{ color: isHover ? '#168cff' : 'var(--color-border-4)'}"
        class="extra-color"
        @mouseover="changeColor(true)"
        @mouseleave="changeColor(false)"
        @click="onClick"
      />
    </template>
    <slot></slot>
  </a-card>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    isShows: true,
    title: "",
  },
  setup() {
    return {
      isHover: ref(false),
    };
  },
  methods: {
    changeColor(isHover) {
      this.isHover = isHover;
    },
    onClick() {
      this.$emit("onRouter");
    },
  },
};
</script>

<style lang="scss" scoped>
.extra-color {
  font-size: 18px;
}
.card-demo {
  width: 100%;
  min-width: 500px;
  transition-property: all;
}
.card-demo :deep(.arco-card-header) {
  border: none;
  padding: 16px;
}
.card-demo :deep(.arco-card-body) {
  padding: 0px 0px 10px 0px;
}
.card-demo:hover {
  transform: translateY(-4px);
}
</style>
