<template>
  <div class="content">
    <div class="form">
      <trends-form
        v-model="value"
        :type="3"
        :options="options"
        :text="'选项'"
        :params="{
                  select:{
                      multiple: true
                  }
              }"
      ></trends-form>
      {{ value }}
    </div>
    <div class="form">
      <trends-form
        v-model="value"
        :type="0"
        :options="options"
        :text="'选项'"
        :params="{
                  select:{
                      multiple: true
                  }
              }"
      ></trends-form>
      {{ value }}
    </div>
    <div class="form">
      <trends-form
        v-model="value"
        :type="5"
        :options="options"
        :text="'选项'"
        :params="{
                  select:{
                      multiple: true
                  }
              }"
      ></trends-form>
      {{ value }}
    </div>
  </div>
</template>

<script>
import TrendsForm from "@/components/TrendsForm.vue";
import { ref, reactive } from "vue";

export default {
  components: {
    TrendsForm,
  },
  setup() {
    return {
      value: ref(""),
      options: reactive([
        {
          label: "a",
          value: "A",
        },
        {
          label: "b",
          value: "B",
        },
        {
          label: "c",
          value: "C",
        },
      ]),
    };
  },
  watch: {
    value: {
      deep: true,
      handler(val) {},
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .form {
    width: 200px;
    height: 100px;
  }
}
</style>