<template>
  <div class="item">
    <iframe :src="domain" frameborder="0" width="100%" :style="{height:calHeight}" scrolling="auto"></iframe>
  </div>
</template>

<script>
export default {
  props: {
    domain: "",
  },
  data() {
    return {
      txtUrl: "",
    };
  },
  computed: {
    //计算属性 , 设置iframe高度为窗口高度少100px
    calHeight() {
      return window.innerHeight - 150 + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 100%;
}
</style>
