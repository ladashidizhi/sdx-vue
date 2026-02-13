<template>
  <div class="item">
    <div style="width:calc(100% - 10px);">
      <span>名称：{{ names }}</span>
      <a-divider />
      <a-space
        direction="vertical"
        fill
        v-for="(data,index) in fromList"
        :key="index"
        style="margin-top:10px"
      >
        <div class="rule">
          <a-space direction="vertical" fill>
            <span>选取设置(必选)</span>
            <a-select
              v-model="data.value"
              :field-names="fieldNames"
              :style="{width:'320px'}"
              placeholder="请选择"
              allow-search
              @change="onSelect(index, $event)"
              allow-clear
            >
              <a-option
                v-for="item, index in options"
                :key="index"
                :value="item.id"
                v-show="cacheSelect.indexOf(item.id) == -1"
              >{{ item.name }}</a-option>
            </a-select>
          </a-space>
          <div style="width: 320px; margin-left: 30px;">
            <a-space size="large" v-if="data.key==='switch'">
              <a-switch style="margin-bottom: 4px;" v-model="data.value1" />
              <span>{{ data.name }}</span>
            </a-space>
            <div v-if="data.key==='text'" style="margin-bottom: 7px;">{{ data.name }}</div>
            <a-checkbox-group v-if="data.key==='checkbox'" v-model="data.value1">
              <a-checkbox value="css">CSS</a-checkbox>
              <a-checkbox value="html">HTML</a-checkbox>
              <a-checkbox value="js">JS</a-checkbox>
            </a-checkbox-group>
            <a-space direction="vertical" fill v-if="data.key==='select'">
              <span>选择{{data.name}}(必选)</span>
              <a-select
                v-model="data.value1"
                :options="data.choices"
                :style="{width:'220px'}"
                placeholder="请选择"
                allow-search
              />
            </a-space>
          </div>
          <a-button v-if="fromList.length!==1" shape="circle" @click="removeForm(index)">
            <icon-close />
          </a-button>
        </div>
      </a-space>
      <a-button style="margin-top:25px" @click="andForm">
        <template #icon>
          <icon-plus />
        </template>
        <template #default>添加设置</template>
      </a-button>
      <a-divider />
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
export default {
  name: "CfRuleView",
  props: {
    names: "",
    from: { type: Array, default: () => [] },
    optionsList: { type: Array, default: () => [] },
  },
  setup() {
    const fieldNames = { value: "id", label: "name" };

    return {
      fromList: ref([]), ///规则
      fieldNames,
      options: reactive([]),
      cacheSelect: reactive([]),
    };
  },
  methods: {
    // 添加表单组件到数组 在数组的最后插入
    andForm() {
      this.from.push({
        value: "",
        model: null,
        choices: null,
        key: "",
        name: "",
        value1: "",
      });
      this.fromList = this.from;
    },
    removeForm(index) {
      // 根据索引从数组中删除表单组件
      this.fromList.splice(index, 1);
    },
    onSelect(index, value) {
      this.options.forEach((e) => {
        if (e.id === value) {
          let choices = null;
          if (e.choices != null) {
            let list = Object.entries(e.choices);
            choices = list.map(([key, value]) => ({
              value: key,
              label: value,
            }));
          }
          this.fromList[index].choices = choices;
          this.fromList[index].key = e.key;
          this.fromList[index].name = e.name;
          if (e.key === "text" || e.key === "switch") {
            this.fromList[index].value1 = true;
          }
        }
      });
    },
  },
  watch: {
    fromList: {
      deep: true,
      handler(val) {
        this.cacheSelect.splice(0, this.cacheSelect.length);
        val.forEach((item) => {
          this.cacheSelect.push(item.value);
        });
      },
    },
    from: {
      deep: true,
      handler(v) {
        this.fromList = v;
      },
    },
    optionsList: {
      deep: true,
      handler(v) {
        this.options = v;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  width: calc(100% - 5px);
  overflow-y: auto;
  height: 100%;
  align-items: left;
  .rule {
    width: 100%;
    display: flex;
    align-items: end;
  }
}
</style>
