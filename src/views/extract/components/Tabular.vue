



<template>
  <div class="items">
    <h2>你好</h2>
    <a-table :columns="columns" :data="data" />
  </div>
</template>
<script>
import { reactive } from "vue";
export default {
  name: "Tabular",
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const data = reactive([
      {
        key: "1",
        name: "Jane Doe",
        salary: 23000,
        address: "32 Park Road, London",
        email: "jane.doe@example.com",
      },
      {
        key: "2",
        name: "Alisa Ross",
        salary: 25000,
        address: "35 Park Road, London",
        email: "alisa.ross@example.com",
      },
      {
        key: "3",
        name: "Kevin Sandra",
        salary: 22000,
        address: "31 Park Road, London",
        email: "kevin.sandra@example.com",
      },
      {
        key: "4",
        name: "Ed Hellen",
        salary: 17000,
        address: "42 Park Road, London",
        email: "ed.hellen@example.com",
      },
      {
        key: "5",
        name: "William Smith",
        salary: 27000,
        address: "62 Park Road, London",
        email: "william.smith@example.com",
      },
    ]);

    return {
      data,
    };
  },
};
</script>
<style lang="scss" scoped>
.items {
  width: 40%;
  height: 60%;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  h2 {
    padding-bottom: 10px;
  }
}
</style>