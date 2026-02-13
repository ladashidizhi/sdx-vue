<template>
  <a-form
    ref="formRef"
    :rules="rules"
    :model="form"
    :style="{width:'520px'}"
    @submit="handleSubmit"
  >
    <a-form-item field="synthesize" label="综合负载" validate-trigger="blur">
      <a-input v-model="form.synthesize" :placeholder="placeholder" />
    </a-form-item>
    <a-form-item field="cpu" label="CPU使用率">
      <a-input v-model="form.cpu" :placeholder="placeholder" />
    </a-form-item>
    <a-form-item field="memory" label="内存占用">
      <a-input v-model="form.memory" :placeholder="placeholder" />
    </a-form-item>
    <a-form-item field="disk" label="磁盘占用">
      <a-input v-model="form.disk" :placeholder="placeholder" />
    </a-form-item>
    <a-form-item field="bandwidth" label="网络宽带">
      <a-input v-model="form.bandwidth" :placeholder="placeholder" />
    </a-form-item>
    <a-form-item field="interval" label="重复间隔">
      <a-input v-model="form.interval" :placeholder="placeholder" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">确认提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { ref } from "vue";
import { GetAlert, PostEditAlert } from "@/api/hosts/index.js";
import { useUsersStore } from "@/store/user.js";

export default {
  setup() {
    const rules = {
      synthesize: [
        {
          required: true,
        },
      ],
      cpu: [
        {
          required: true,
        },
      ],
      memory: [
        {
          required: true,
        },
      ],
      disk: [
        {
          required: true,
        },
      ],
      bandwidth: [
        {
          required: true,
        },
      ],
      interval: [
        {
          required: true,
        },
      ],
    };
    return {
      rules,
      form: ref({
        id: 0,
        synthesize: 0,
        cpu: 0,
        memory: 0,
        disk: 0,
        bandwidth: 0,
        interval: 0,
        host_id: 0,
        user_id: 0,
      }),
      placeholder: "请输入",
      usersStore: useUsersStore(),
    };
  },
  mounted() {
    this.onGetAlert();
  },
  methods: {
    async onGetAlert() {
      try {
        const response = await GetAlert(this.usersStore.host.id);
        if (response.code === 0) {
          this.form = response.data;
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    handleSubmit({ values }) {
      this.SubmitAddHost(values);
    },
    async SubmitAddHost(values) {
      try {
        const response = await PostEditAlert(values);
        if (response.code === 0) {
          this.$message.success(response.msg);
          this.$emit("custom-event", "1");
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
  },
};
</script>