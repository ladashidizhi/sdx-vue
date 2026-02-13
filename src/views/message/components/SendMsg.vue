<template>
  <div style="position: fixed;top:0;left:0;display: none;"></div>
</template>
<script>
import { IconCloseCircle } from "@arco-design/web-vue/es/icon";
import { h, ref } from "vue";
import { Button } from "@arco-design/web-vue";
import { SubMessageLogs } from "@/api/home/index.js";
import Notify from "@wcjiang/notify";

export default {
  name: "SendMsg",
  components: {},
  props: {
    // params:{
    //   type: Object,
    //   default(){
    //     return {
    //         notifiType: Number(0),
    //         contentSend: "",
    //         titleSend: 0,
    //         id: 0,
    //         sendType: 0
    //     }
    //   }
    // },
    params: { type: String, default: () => "" },
    //    notifiType: { type: Number, default: () => 0 },
    //    contentSend:{type:String,default:()=>""},
    //    titleSend:{type:Number,default:()=>0},
    //    id:{type:Number,default:()=>0},
    //    sendType: { type: Number, default: () => 0 },
  },
  setup() {
    const keyValue = ref("");
    const sendTypev = ref(1);
    const importent = { 1: "通知", 2: "普通", 3: "重要", 4: "紧急", 5: "严重" };
    const notifiTypeT = {
      1: "info",
      2: "info",
      3: "success",
      4: "warning",
      5: "error",
    };
    const handleKeyValue = () => {
      keyValue.value = notifiTypeT[notifiTypev];
    };

    return {
      notifiTypev: ref(0), //运算符
      titlev: ref(0), //运算符
      contentv: ref(""), //运算符
      idv: ref(0), //运算符
      importent,
      notifiTypeT,
      handleKeyValue,
      keyValue,
      sendTypev,
    };
  },
  mounted() {},
  methods: {
    showNotifi(v) {
      if (v.sendType == 1) {
        const keyVal = this.notifiTypeT[v.notifiType];
        if (keyVal) {
          this.$notification[keyVal]({
            title: v.titleSend,
            content: v.contentSend,
            closable: true,
            showIcon: false,
            duration: 3000,
            closeIcon: h(IconCloseCircle),
            footer: h(
              "div",
              {
                style:
                  "display:flex; justify-content: right; width:100%;align-content:center;",
              },
              [
                h(
                  Button,
                  {
                    size: "small",
                    type: "primary",
                    style: "margin-right:15px;",
                    onClick: this.setClicked,
                  },
                  "确定"
                ),
              ]
            ),
            onClose: this.onSetClose,
          });
        }
      }
      if (v.sendType == 2) {
        const notify = new Notify({
          effect: "flash",
          interval: 500,
        });
        notify.notify({
          title: v.titleSend,
          body: v.contentSend,
          openurl: "https://jaywcjlove.github.io",
          onclick: function () {},
          onshow: function () {},
        });
      }
    },
    async onSetClose() {},
    async setClicked() {
      if (this.idv) {
        let data = {
          id: this.idv,
          is_sure: 2,
        };
        const response = await SubMessageLogs(data);
        this.$message.success(response.msg);
      }
    },
  },
  watch: {
    params: {
      immediate: true,
      // deep: true,
      handler(v) {
        if (v) {
          this.showNotifi(JSON.parse(v));
        }
      },
    },
  },
};
</script>
