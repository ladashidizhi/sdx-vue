<template>
  <div class="item" :style="{height: height + 'px'}">
    <div class="row">
      <div class="top">
        <div class="left_class"></div>
        <span style="color:var(--color-text-2)">{{ name }}</span>
      </div>
      <slot name="slotRight"></slot>
    </div>
    <slot name="slotSub"></slot>
  </div>
</template>

<script>
export default {
  name: "CardCell",
  props: {
    height: 0,
    width: 0,
    name: "",
  },
};
</script>

<style lang="scss" scoped>
.item {
  margin: 10px 10px 0px 0px;
  width: calc(100% - 10px);
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 18px;
  background: var(--app-glass-2);
  border: 1px solid var(--app-stroke);
  box-shadow: var(--app-shadow);
  backdrop-filter: blur(var(--app-blur));
  -webkit-backdrop-filter: blur(var(--app-blur));
  overflow: hidden;
}
.item::before{
  content:"";
  position:absolute;
  inset:-1px;
  border-radius: 18px;
  pointer-events:none;
  background:
    radial-gradient(700px 200px at 18% 0%, rgba(110,86,255,.22), transparent 60%),
    radial-gradient(520px 220px at 86% 0%, rgba(54,160,255,.16), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0));
  opacity:.9;
}
.item::after{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), inset 0 -24px 48px rgba(0,0,0,.25);
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 14px 8px 16px;
  position: relative;
  z-index: 1;
}
.top {
  display: flex;
  height: 28px;
  align-items: center;
  gap: 10px;
}
.left_class {
  width: 3px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(54,160,255,.95), rgba(110,86,255,.92));
  box-shadow: 0 0 0 1px rgba(120,180,255,.18), 0 0 14px rgba(110,86,255,.28);
}
</style>