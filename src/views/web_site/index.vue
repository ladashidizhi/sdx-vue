<template>
  <div class="site">
    <a-card class="card">
      <template #title>
        <div class="row_cell">
          <h3>添加站点</h3>
          <h3>Ac-01</h3>
          <h3>192.168.50.56</h3>
        </div>
      </template>
      <template #extra>
        <a-link class="title">More</a-link>
      </template>
      ByteDance's core product, Toutiao ("Headlines"), is a content platform in
      China and around the world. Toutiao started out as a news recommendation
      engine and gradually evolved into a platform delivering content in various
      formats.
    </a-card>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.site {
  width: 100%;
  height: 100%;
  display: "flex";
  .card {
    background-color: white;

    border: none;
    height: 99.6%;
    .row_cell {
      width: 100%;
      display: flex;
    }
    h3 {
      color: black;
      padding-right: 60px;
    }
  }
}
</style>