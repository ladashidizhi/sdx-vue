<template>
  <div style="width: 500px;display: flex;">
    <a-range-picker
      class="contaic"
      shortcuts-position="right"
      :shortcuts="rangeShortcuts"
      v-model="timeList"
      :disabledDate="(current) => dayjs(current).isAfter(dayjs())"
      @change="change"
    />
    <slot></slot>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { ref } from "vue";
export default {
  props: {
    list: { type: Array, required: true },
  },
  setup() {
    return {
      dayjs,
      rangeShortcuts: [
        {
          label: "最近7天",
          value: () => [
            dayjs().subtract(7, "day").startOf("day"),
            dayjs().startOf("day"),
          ],
        },
        {
          label: "最近30天",
          value: () => [
            dayjs().subtract(30, "day").startOf("day"),
            dayjs().startOf("day"),
          ],
        },
        {
          label: "最近半年",
          value: () => [
            dayjs().subtract(180, "day").startOf("day"),
            dayjs().startOf("day"),
          ],
        },
      ],
      timeList: ref([]),
    };
  },
  methods: {
    change(e) {
      this.timeList = [dayjs(e[0]).startOf("day"), dayjs(e[1]).endOf("day")];
      this.$emit("update:list", this.timeList);
      this.$emit("time", this.timeList);
    },
  },
  watch: {
    list: {
      immediate: true,
      handler(v) {
        this.timeList = v;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.contaic {
  width: 400px;
  border: 1px solid var(--color-theme-borderColor);
  margin-bottom: 20px;
}
</style>
