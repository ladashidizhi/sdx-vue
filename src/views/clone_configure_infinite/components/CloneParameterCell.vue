<template>
  <div
    :style="{ height: height - 70 + 'px' }"
    style="
      overflow-y: auto; /* 根据内容是否超出容器高度自动显示/隐藏垂直滚动条 */
    "
  >
    <a-space style="margin-bottom: 15px">
      <a-button
        type="primary"
        @click="onChange"
        style="height: 23px; margin-right: 80px"
        >保存修改</a-button
      >
      <a-tag color="orange">
        <template #icon>
          <icon-drag-dot-vertical />
        </template>
        拖拽可以排序参数位置
      </a-tag>
      <a-tag color="blue">
        <template #icon>
          <icon-edit />
        </template>
        给不常用的克隆参数配置默认值
      </a-tag>
      <a-tag color="green">
        <template #icon>
          <icon-select-all />
        </template>
        常用参数设置可见性
      </a-tag>
    </a-space>
    <a-table
      :pagination="false"
      :columns="columns"
      :data="cloneList"
      :draggable="{ type: 'handle', width: 40 }"
      @change="handleChange"
      :loading="loading"
    >
      <template #optional="{ rowIndex }">
        <trends-form
          v-if="flag"
          v-model="cloneList[rowIndex].context"
          :type="cloneList[rowIndex].component"
          :options="cloneList[rowIndex].value"
          :text="'选项'"
          :params="
            cloneList[rowIndex].component !== 1
              ? {}
              : {
                  switch: {
                    type: 'round',
                  },
                }
          "
        ></trends-form>
        <div style="height: 30px" v-else></div>
      </template>
      <template #is_hide="{ rowIndex }">
        <a-switch
          size="small"
          v-model="cloneList[rowIndex].is_hide"
          type="line"
        ></a-switch>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { getCloneConfigFml, postCloneConfig } from "@/api/clone/index";
export default {
  props: {
    height: 0,
  },
  setup() {
    const columns = reactive([
      {
        title: "名称",
        dataIndex: "name",
        width: 145,
      },
      {
        title: "内置默认值",
        slotName: "optional",
        width: 210,
      },
      {
        title: "是否可见",
        slotName: "is_hide",
        width: 100,
      },
      {
        title: "功能说明",
        dataIndex: "help",
        // slotName: "remark",
      },
      // {
      //   title: "关联词库"
      // }
      // ,
      // {
      //   title: "是否实时生效"
      // }
    ]);

    return {
      columns,
      flag: ref(true),
      cloneList: ref([]),
      value: ref(""),
      cloneId: ref(0),
      loading: ref(false),
    };
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    async onChange() {
      let list = JSON.parse(JSON.stringify(this.cloneList));
      list.forEach((e) => {
        if (e.component === 2) {
          if (e.context === "") {
            e.context === 0;
          }
        }
        if (typeof e.context === "boolean") {
          e.context = e.context ? 1 : 0;
        }
      });
      await postCloneConfig(list, this.cloneId, 2);
    },
    async fetchData() {
      this.loading = true;
      const response = await getCloneConfigFml();
      const data = response.data;
      this.cloneList = data.config;
      this.cloneList.forEach((e) => {
        if (e.component === 1) {
          e.context = e.context === 1 ? true : false;
        }
      });
      this.cloneId = data.id;
      this.loading = false;
    },
    //拖拽排序
    async handleChange(_data) {
      this.flag = false;
      this.cloneList.splice(0, this.cloneList.length);
      this.cloneList = _data;
      this.cloneList.forEach((e, index) => {
        e.sort = index + 1;
      });
      setTimeout(() => {
        this.flag = true;
      });
      // this.cloneList.forEach((e) => {
      //   _data.forEach((a) => {
      //     if (e.field == a.field) {
      //       a.context = e.context;
      //     }
      //   });
      // });
      // console.log(_data);

      await postCloneConfig(this.cloneList, this.cloneId,2);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>