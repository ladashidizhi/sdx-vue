<template>
  <div class="site_item">
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.site_item {
  width: 100%;
  height: 100%;
  .container {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    padding: 16px;
    margin: 20px;

    border-radius: var(--r18);
    border: 1px solid var(--app-stroke);
    background: linear-gradient(180deg, var(--app-panel), var(--app-panel2));
    box-shadow: var(--app-shadow);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  }
}
</style>