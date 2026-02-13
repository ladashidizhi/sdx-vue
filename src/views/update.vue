<template>
  <div class="item">
    <div class="center">
      <div class="process">
        <a-progress
          type="circle"
          :size="'large'"
          stroke-width="2"
          :animation="true"
          :percent="process/100"
          :color="{
            '0%': '#d31146',
            '100%': 'rgb(255, 150, 38)',
          }"
        />
      </div>
      <div class="text">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import { GetMasterUpgradeState } from "@/api/hosts/soft";
import { ref } from "vue";
export default {
  setup() {
    return {
      model: ref(null),
      cpuChart: ref(null),
      process: ref(0),
      message: ref("升级群控"),
    };
  },
  mounted() {
    const timer = setInterval(async () => {
      const result = await GetMasterUpgradeState();
      if (result.code === 6) {
        this.$message.success("升级群控成功");
        this.$router.back();
        clearInterval(timer);
      } else if (result.code === 7) {
        this.$message.error(result.msg);
        this.$router.back();
        clearInterval(timer);
      } else {
        if (result.data != null) {
          this.message = result.data.message;
          this.process = result.data.process;
        }
      }
    }, 2000);
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 100%;

  .center {
    width: 400px;
    height: 420px;
    position: fixed;
    top: calc(50% - 200px);
    left: calc(50% - 200px);
    .process {
      width: 100%;
      height: 400px;
      :deep(.arco-progress-circle-wrapper) {
        width: 400px !important;
        height: 400px !important;
      }
    }
    .text {
      text-align: center;
      margin-top: 15px;
      cursor: default;
    }
  }
}
</style>