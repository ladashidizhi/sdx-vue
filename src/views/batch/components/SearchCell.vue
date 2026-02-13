<template>
  <div class="items">
    <div class="row">
      <div class="left">
        <slot></slot>
      </div>
      <a-divider direction="vertical" style="height: 40px;" />
      <!-- <a-space direction="vertical" fill size="large">
        <a-space>
          <span>收录</span>
          <a-radio-group v-model="form.include">
            <a-radio value="0">不限</a-radio>
            <a-radio value="1">有</a-radio>
            <a-radio value="2">无</a-radio>
          </a-radio-group>
        </a-space>
        <a-space>
          <span>权重</span>
          <a-input-group>
            <a-select
              v-model="form.rankSymbol"
              :options="[{value:'>',label:'大于'},{value:'<',label:'小于'}]"
              :style="{width:'90px'}"
              placeholder="请选择"
            />
            <a-input-number
              v-model="form.rank"
              :style="{width:'240px'}"
              placeholder="请输入"
              class="input-demo"
              :min="1"
              :max="100"
              model-event="input"
            />
          </a-input-group>
        </a-space>
      </a-space>-->
      <div class="group">
        <a-space>
          <span style="color: var(--color-text-1);">分组</span>
          <a-select
            v-model="form.group"
            :style="{width:'320px'}"
            placeholder="请选择"
            :options="group"
            :field-names="fieldNames"
            multiple
            allow-clear
          ></a-select>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "SearchCell",
  props: {
    search: { type: Object, required: true },
    group: { type: Array, required: true },
  },
  setup() {
    const fieldNames = { value: "name", label: "name" };
    return {
      fieldNames,
      options: ref([]),
      form: ref({}),
    };
  },
  watch: {
    form(v) {
      this.$emit("update:search", v);
    },
    search: {
      immediate: true,
      handler(v) {
        this.form = v;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.items {
  width: calc(100% - 40px);
  border: 1px solid var(--app-stroke);
  padding: 10px;
  margin: 0px 10px 0px 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  .row {
    width: calc(100% - 10px);
    height: 100%;
    display: flex;
    align-items: center;
    .left {
      width: 100px;
      margin-left: 40px;
    }
  }
  .group {
    height: 40px;
    margin-left: 20px;
    width: 400px;
    display: flex;
    align-items: start;
  }
}
</style>