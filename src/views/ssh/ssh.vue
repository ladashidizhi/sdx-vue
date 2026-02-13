<template>
  <div class="ssh">
    <ssh-view :webGL="true" :wsurl="wsurl" v-if="alive"></ssh-view>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/store/user.js";
import { ref } from "vue";
import SshView from "@/components/SSH.vue";
import { buildWebSocketUrl } from "@/utils/websocket";
export default {
  components: {
    SshView,
  },
  setup() {
    const { host } = storeToRefs(useUsersStore());

    return {
      wsurl: ref(""),
      alive: ref(true),
      host,
    };
  },
  mounted() {},
  watch: {
    host: {
      immediate: true,
      deep: true,
      handler: (function () {
        let t = null;
        return function (val) {
          this.$message.warning("已切换到主机:" + val.name);
          clearTimeout(t);
          this.alive = false;
          this.wsurl = buildWebSocketUrl(`/terminals?hostId=${val.id}`);
          t = setTimeout(() => {
            this.alive = true;
          }, 1000);
        };
      })(),
    },
  },
};
</script>

<style lang="scss" scoped>
.ssh {
  width: 100%;
  height: 100%;
  padding: 5px 0px 0px 5px;
  box-sizing: border-box;
  background-color: #181d28;
}
</style>