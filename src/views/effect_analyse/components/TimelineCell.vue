<template>
  <a-space class="spiders">
    <svg class="ali-icon" aria-hidden="true">
      <use :xlink:href="image" />
    </svg>
    <a-space direction="vertical" size="mini">
      {{ name }}
      <div :style="{ fontSize: '12px', color: '#4E5969' }">{{ timeName }}</div>
    </a-space>
  </a-space>
</template>

<script>
export default {
  name: "TimelineCell",
  props: {
    name: "",
    timeName: "",
    image: "",
  },
};
</script>
<style lang="scss" scoped>
.spiders {
  width: 150px;
  align-items: center;
  display: flex;
}
.ali-icon {
  width: 40px;
  height: 40px;
}
</style>