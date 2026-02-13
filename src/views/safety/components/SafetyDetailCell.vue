<template>
  <a-space direction="vertical" fill style="margin-bottom: 10px;">
    <h3 style="margin-left: 5px;">匹配服务</h3>
    <div style="width: 100%;display: flex;">
      <div style="width: 50%;margin-left:5px ;">
        <RowTextCell name="用户ID" :value="items.user_id || '-'" />
      </div>
      <div style="width: 50%;">
        <RowTextCell name="服务器ID" :value="items.host_id || '-'" />
      </div>
    </div>
    <div style="width: 100%;display: flex;">
      <div style="width: 50%;margin-left:5px ;">
        <RowTextCell name="规则类型" :value="items.rule_name || '-'" />
      </div>
      <div style="width: 50%;">
        <RowTextCell name="响应大小" :value="formatBytes(items.size)" />
      </div>
    </div>
    <a-divider />
    <h3 style="margin-left: 5px;">请求详情信息</h3>
    <div style="width: 100%;display: flex;">
      <div
        style="width:calc(50% - 10px);"
        :class="isDomain?'back_true':'back_false'"
        @mouseenter="domainMouseEnter"
        @mouseleave="domainMouseLeave"
      >
        <RowTextCell name="响应主机" :value="items.domain">
          <a-tag
            checkable
            :checked="true"
            bordered
            color="blue"
            v-if="isDomain"
            @click="screen(items.domain,'domain')"
          >筛选</a-tag>
        </RowTextCell>
      </div>
      <div style="width: 50%;">
        <RowTextCell name="请求方法" :value="items.method" />
      </div>
    </div>
    <div style="width: 100%;display: flex;">
      <div
        style="width:calc(50% - 10px);"
        :class="isIp?'back_true':'back_false'"
        @mouseenter="ipMouseEnter"
        @mouseleave="ipMouseLeave"
      >
        <RowTextCell name="客户机IP" :value="items.ip">
          <a-tag
            checkable
            :checked="true"
            bordered
            color="blue"
            v-if="isIp"
            @click="screen(items.ip,'ip')"
          >筛选</a-tag>
        </RowTextCell>
      </div>
      <div style="width: 50%;">
        <RowTextCell name="国家/地区" :value="items.area" />
      </div>
    </div>
    <div class="back_false">
      <div style="width: calc(50% - 5px) ;">
        <RowTextCell name="路径" :value="isName(items.path,true)" />
      </div>
      <div style="width: 50%">
        <RowTextCell name="响应码" :value="items.code" />
      </div>
    </div>
    <div class="back_false">
      <RowTextCell name="查询字符串" :value="isName(items.parameter)" />
    </div>

    <div class="back_false">
      <RowTextCell name="Referer" :value="isName(items.referer)" />
    </div>
    <div class="back_false">
      <RowTextCell name="用户代理" :value="items.agent" />
    </div>
  </a-space>
</template>
<script>
import RowTextCell from "@/views/safety/components/RowTextCell.vue";
import { ref } from "vue";

export default {
  components: {
    RowTextCell,
  },
  props: {
    items: {},
  },
  setup() {
    return {
      isIp: ref(false),
      isDomain: ref(false),
      form: ref({
        domain: "",
        ip: "",
      }),
    };
  },
  methods: {
    ipMouseEnter() {
      this.isIp = true;
    },
    ipMouseLeave() {
      this.isIp = false;
    },
    domainMouseEnter() {
      this.isDomain = true;
    },
    domainMouseLeave() {
      this.isDomain = false;
    },
    isName(name, type = false) {
      if (name.length === 0) {
        name = type ? "/" : "空";
      }
      return name;
    },
    screen(name, type) {
      switch (type) {
        case "domain":
          this.form.domain = name;
          break;
        case "ip":
          this.form.ip = name;
          break;
      }
      this.$emit("save", this.form);
    },
    formatBytes(byte, decimals = 2) {
      let bytes = parseInt(byte);
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background-color: var(--color-menu-light-bg);
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}
.back_true {
  background-color: var(--color-inner-bg-color);
  padding: 5px;
}
.back_false {
  background-color: transparent;
  padding: 5px;
  width: 100%;
  display: flex;
}
</style>
