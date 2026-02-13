<template>
  <div id="login">
    <!-- 背景特效层（更炸：漂浮霓虹团 + 扫描线） -->
    <div class="login_fx" aria-hidden="true">
      <div class="orb o1"></div>
      <div class="orb o2"></div>
      <div class="orb o3"></div>
      <div class="scan"></div>
    </div>
    <!-- <div id="login_background"></div> -->
    <a-spin :loading="loading" style="width: 100%;height: 100%;" tip="登录中...">
      <div class="login_content glass">
        <div class="brand">
          <div class="brand_mark" aria-hidden="true"><span class="brand-icon">⚡</span> </div>
          <div class="brand_text">
            <div class="brand_title"><span class="login-title-gradient">闪电侠控制台</span></div>
            <div class="brand_sub">登录以继续</div>
          </div>
        </div>
        <div class="form_item">
          <div class="icon">
            <icon-user-group />
          </div>
          <div class="textarea">
            <input
              type="text"
              placeholder="用户名"
              v-model="username.value"
              @focus="username.focus=true"
              @blur="username.focus=false"
            />
          </div>
          <div
            class="line button_user_line"
            :style="{'transform': username.focus ? '' : 'scaleX(0)'}"
          ></div>
        </div>
        <div class="form_item">
          <div class="icon pwd">
            <icon-lock />
          </div>
          <div class="textarea pwd">
            <input
              type="password"
              v-model="password.value"
              placeholder="密码"
              @focus="password.focus=true"
              @blur="password.focus=false"
            />
          </div>
          <div
            class="line button_pwd_line"
            :style="{'transform': password.focus ? '' : 'scaleX(0)'}"
          ></div>
        </div>

        <div class="login_button" @click="login">登录</div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import * as THREE from "three";
import { ref, reactive } from "vue";
import CLOUDS from "vanta/dist/vanta.clouds.min";

import { Login } from "@/api/login/index";

import { useUsersStore } from "@/store/user.js";

export default {
  name: "Login",
  setup() {
    const userStore = useUsersStore();

    const date = new Date();
    const CloudConfig = ref({
      Light: {
        backgroundColor: 0x00000,
        cloudShadowColor: 0x183550,
        skyColor: 0x68b8d7,
        cloudColor: 0xd7d7eb,
        sunColor: 0xff9919,
        sunGlareColor: 0x7f7c7c,
        sunlightColor: 0xff9933,
      },
      Night: {
        backgroundColor: 0x0,
        skyColor: 0x3e3e41,
        cloudColor: 0x626275,
        cloudShadowColor: 0x0,
        sunColor: 0x525252,
        sunGlareColor: 0x0,
        sunlightColor: 0x0,
      },
    });

    //
    const CloudCompoment = null;
    const CloudCompomentInterVal = null;
    const DarkMode = !(date.getHours() >= 18 || date.getHours() <= 7); // 暗夜深色模式

    //
    const username = reactive({
        // 用户名
        value: "",
        focus: false,
      }),
      password = reactive({
        // 密码
        value: "",
        focus: false,
      });

    return {
      CloudConfig,
      CloudCompoment,
      CloudCompomentInterVal,
      DarkMode,
      username,
      password,
      userStore,
      loading: ref(false),
    };
  },
  methods: {
    async login(e) {
      if (e.keyCode) {
        if (e.keyCode !== 13) {
          return;
        }
      }
      if (this.username.value.trim().length === 0) {
        this.$message.error("请正确填写用户名");
      } else if (this.password.value.trim().length === 0) {
        this.$message.error("请正确填写密码");
      } else {
        this.loading = true;
        const result = await Login(this.username.value, this.password.value);
        this.loading = false;
        if (result.code === 7) {
          this.$message.error("用户名或密码错误");
        } else {
          this.$message.success("登录成功");
          // 兼容后端不返回用户名字段：把本次输入的用户名也写入 store
          const userInfo = { ...(result.data || {}), username: this.username.value };
          // ✅ 记录是否以“总管理员 admin”登录（切换到其它管理员账号后仍保留可切换能力）
          // 说明：这是前端展示/便捷切换用的标记，不影响后端鉴权。
          userInfo.__rootAdmin = String(this.username.value || "").toLowerCase() === "admin";
          this.userStore.setUserInfo(userInfo);

          // ✅ 权限分流：admin / lds-admin / ok-admin / niu-admin 进入独立的 Admin 首页（与原首页区分）
          const adminUsers = ["admin", "lds-admin", "ok-admin", "niu-admin"];
          if (adminUsers.includes((this.username.value || "").toLowerCase())) {
            this.$router.replace("/admin");
          } else {
            // 其他用户仍然进入原首页
            this.$router.replace("/home/infinite");
          }
        }
      }
    },
    updateCloud(date = new Date(), focus = false) {
      const darkMode = date.getHours() >= 18 || date.getHours() <= 7;
      if (darkMode === this.DarkMode && !focus) {
        return;
      }
      this.DarkMode = darkMode;
      const config = darkMode ? this.CloudConfig.Night : this.CloudConfig.Light;
      try {
        this.CloudCompoment.destroy();
      } catch (e) {}
      this.CloudCompoment = CLOUDS({
        THREE,
        el: "#login",
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        ...config,
        speed: 3,
      });
    },
  },
  mounted() {
    // window.addEventListener("keydown", this.login);
    // this.updateCloud();
    // this.CloudCompomentInterVal = setInterval(() => {
    //   this.updateCloud();
    // }, 5000);
  },
  beforeUnmount() {
    // window.removeEventListener("keydown", this.login);
    // clearInterval(this.CloudCompomentInterVal);
    // this.CloudCompoment.destroy();
  },
};
</script>

<style lang="scss" scoped>
#login{
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 0;
  box-sizing:border-box;
  position: relative;
  overflow: hidden;
  /* 炸裂暗紫底色（多层叠加） */
  background:
    radial-gradient(900px 500px at 15% 10%, rgba(168, 74, 255, .28), transparent 60%),
    radial-gradient(820px 520px at 85% 15%, rgba(102, 52, 255, .26), transparent 62%),
    radial-gradient(980px 620px at 65% 85%, rgba(54, 140, 255, .14), transparent 62%),
    linear-gradient(135deg, #070011, #0b0020 36%, #060010);
}

/* 旋转的霓虹流光层（柔和但很“炸”） */
#login::before{
  content:"";
  position:absolute;
  inset:-60%;
  background: conic-gradient(
    from 180deg,
    rgba(164, 73, 255, .00),
    rgba(164, 73, 255, .22),
    rgba(255, 255, 255, .06),
    rgba(96, 170, 255, .18),
    rgba(164, 73, 255, .20),
    rgba(164, 73, 255, .00)
  );
  filter: blur(110px);
  opacity: .95;
  animation: loginRotate 16s linear infinite;
  pointer-events:none;
}

/* 粒子星空 + 漂移（纯 CSS，不吃性能） */
#login::after{
  content:"";
  position:absolute;
  inset:-20%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,.18) 0 1px, transparent 2px),
    radial-gradient(circle at 60% 10%, rgba(188,128,255,.18) 0 1px, transparent 2px),
    radial-gradient(circle at 80% 60%, rgba(120,180,255,.16) 0 1px, transparent 2px),
    radial-gradient(circle at 35% 75%, rgba(255,255,255,.12) 0 1px, transparent 2px),
    radial-gradient(circle at 50% 50%, rgba(188,128,255,.10) 0 1px, transparent 2px);
  background-size: 260px 260px, 300px 300px, 340px 340px, 220px 220px, 420px 420px;
  background-position: 0 0, 40px 20px, -30px 60px, 80px -40px, 0 0;
  opacity: .75;
  mix-blend-mode: screen;
  filter: blur(.2px);
  animation: loginStars 18s ease-in-out infinite alternate;
  pointer-events:none;
}

@keyframes loginRotate{
  from{ transform: rotate(0deg); }
  to{ transform: rotate(360deg); }
}

@keyframes loginStars{
  0%{ transform: translate3d(-1%, -1%, 0) scale(1.02); }
  100%{ transform: translate3d(1.2%, 1%, 0) scale(1.06); }
}

/* 把主要内容层抬到背景之上（排除特效层） */
#login > :not(.login_fx){
  position: relative;
  z-index: 2;
}

/* 额外特效层：漂浮霓虹团 + 扫描线 */
.login_fx{
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.orb{
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: .55;
  mix-blend-mode: screen;
  transform: translate3d(0,0,0);
}

.orb.o1{
  left: -220px;
  top: -240px;
  background: radial-gradient(circle at 30% 30%, rgba(180, 90, 255, .75), rgba(180, 90, 255, .00) 60%);
  animation: orbFloat1 9s ease-in-out infinite;
}

.orb.o2{
  right: -260px;
  top: 8%;
  background: radial-gradient(circle at 40% 35%, rgba(96, 170, 255, .62), rgba(96, 170, 255, .00) 62%);
  animation: orbFloat2 10.5s ease-in-out infinite;
}

.orb.o3{
  left: 18%;
  bottom: -320px;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, .18), rgba(164, 73, 255, .38), rgba(164, 73, 255, .00) 66%);
  opacity: .38;
  animation: orbFloat3 12s ease-in-out infinite;
}

@keyframes orbFloat1{
  0%,100%{ transform: translate3d(0,0,0) scale(1); }
  50%{ transform: translate3d(90px, 70px, 0) scale(1.05); }
}

@keyframes orbFloat2{
  0%,100%{ transform: translate3d(0,0,0) scale(1); }
  50%{ transform: translate3d(-110px, 50px, 0) scale(1.06); }
}

@keyframes orbFloat3{
  0%,100%{ transform: translate3d(0,0,0) scale(1.02); }
  50%{ transform: translate3d(40px, -90px, 0) scale(1.08); }
}

.scan{
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      180deg,
      rgba(255,255,255,.00) 0px,
      rgba(255,255,255,.00) 6px,
      rgba(255,255,255,.035) 7px,
      rgba(255,255,255,.00) 10px
    );
  opacity: .22;
  mix-blend-mode: overlay;
  animation: scanMove 6.2s linear infinite;
}

@keyframes scanMove{
  from{ transform: translateY(-18px); }
  to{ transform: translateY(18px); }
}

.login_content{
  width: min(560px, 92vw);
  padding: 22px 22px 18px;
  border-radius: var(--r22);
  position: relative;
  overflow:hidden;
  margin: 10% auto 0;
}

/* 卡片后方霓虹“能量环” */
.login_content::after{
  content:"";
  position:absolute;
  inset:-26px;
  border-radius: calc(var(--r22) + 26px);
  background:
    radial-gradient(420px 220px at 18% 20%, rgba(164, 73, 255, .35), transparent 65%),
    radial-gradient(420px 220px at 82% 10%, rgba(96, 170, 255, .22), transparent 68%),
    radial-gradient(520px 260px at 70% 85%, rgba(255, 255, 255, .10), transparent 70%);
  filter: blur(24px);
  opacity: .95;
  z-index: -1;
  animation: loginAura 6.5s ease-in-out infinite;
  pointer-events:none;
}

@keyframes loginAura{
  0%,100%{ transform: translateY(0) scale(1); opacity: .85; }
  50%{ transform: translateY(-6px) scale(1.02); opacity: 1; }
}

/* subtle top glow */
.login_content::before{
  content:"";
  position:absolute;
  inset:-2px -2px auto -2px;
  height: 140px;
  background:
    radial-gradient(420px 180px at 18% 20%, rgba(var(--app-accent2), .26), transparent 60%),
    radial-gradient(420px 200px at 80% 10%, rgba(var(--app-accent), .26), transparent 58%);
  pointer-events:none;
  opacity:.9;
}

.brand{
  position:relative;
  display:flex;
  align-items:center;
  gap: 12px;
  margin-bottom: 16px;
}

.brand_mark{
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid var(--app-stroke2);
  background:
    radial-gradient(16px 16px at 30% 30%, rgba(255,255,255,.34), transparent 60%),
    linear-gradient(135deg, rgba(var(--app-accent), .95), rgba(var(--app-accent2), .85));
  box-shadow: 0 10px 22px rgba(0,0,0,.18);
}

.brand_title{
  font-size: 18px;
  font-weight: 800;
  letter-spacing: .4px;
  color: var(--color-text-1);
}

.brand_sub{
  font-size: 13px;
  margin-top: 2px;
  color: var(--color-text-3);
}

.form_item{
  position:relative;
  display:flex;
  align-items:center;
  gap: 10px;
  height: 48px;
  padding: 0 12px;
  margin-top: 12px;
  border-radius: 14px;
  border: 1px solid var(--ctl-stroke);
  background: var(--ctl-bg);
  box-shadow: var(--ctl-shadow);
  transition: transform .18s ease, border-color .18s ease;
}

.form_item:hover{
  border-color: var(--ctl-stroke2);
  transform: translateY(-1px);
}

.icon{
  width: 22px;
  height: 22px;
  display:flex;
  align-items:center;
  justify-content:center;
  color: rgba(var(--app-accent2), .95);
  font-size: 18px;
}

.icon.pwd{ color: rgba(var(--app-accent), .95); }

.textarea{ flex:1; }

.textarea input{
  width:100%;
  height: 48px;
  line-height: 48px;
  border:none;
  outline:none;
  background:transparent;
  font-size: 14px;
  font-weight: 650;
  color: var(--color-text-4);
  padding-left: 15px;
}

.textarea input::placeholder{
  color: var(--color-text-3);
  font-weight: 500;
}

.line{
  position:absolute;
  left: 12px;
  right: 12px;
  bottom: -1px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(var(--app-accent), .0), rgba(var(--app-accent), .85), rgba(var(--app-accent2), .85), rgba(var(--app-accent2), 0));
  transform-origin: 50% 50%;
  transition: transform .22s ease;
}

.login_button{
  width: 100%;
  height: 48px;
  margin-top: 18px;
  border-radius: 999px;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  user-select:none;
  font-weight: 800;
  letter-spacing: 8px;
  color: rgba(255,255,255,.96);
  border: 1px solid rgba(255,255,255,.16);
  background: linear-gradient(90deg, rgba(var(--app-accent), .98), rgba(var(--app-accent2), .92), rgba(96,170,255,.80));
  background-size: 220% 100%;
  box-shadow:
    0 18px 42px rgba(0,0,0,.32),
    0 0 0 1px rgba(164, 73, 255, .18),
    0 0 36px rgba(164, 73, 255, .22);
  position:relative;
  overflow:hidden;
  transition: transform .18s ease, filter .18s ease;
  animation: btnShift 2.8s ease-in-out infinite;
}

@keyframes btnShift{
  0%,100%{ background-position: 0% 50%; filter: brightness(1.02); }
  50%{ background-position: 100% 50%; filter: brightness(1.12); }
}

/* light sweep on hover */
.login_button::before{
  content:"";
  position:absolute;
  inset:-40% auto -40% -60%;
  width: 60%;
  transform: rotate(18deg);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.30), transparent);
  filter: blur(1px);
  opacity: 0;
  transition: opacity .18s ease, left .58s ease;
}

/* 轻微能量脉冲 */
.login_button::after{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius: inherit;
  background: radial-gradient(120px 60px at 30% 30%, rgba(255,255,255,.22), transparent 60%);
  opacity: .0;
  transition: opacity .18s ease;
}

.login_button:hover{
  transform: translateY(-1px);
  filter: brightness(1.08);
}

.login_button:hover::before{
  opacity: 1;
  left: 120%;
}

.login_button:hover::after{ opacity: .65; }

.login_button:active{
  transform: translateY(0px) scale(.99);
  filter: brightness(1.0);
}

.login-title-gradient {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(90deg,#9f5bff,#6cf0ff,#9f5bff);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleFlow 4s linear infinite;
  text-shadow: 0 0 18px rgba(159,91,255,.6);
}

@keyframes titleFlow {
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
}

/* center + glow */
.login-container {
  position: absolute !important;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  box-shadow:
    0 0 40px rgba(159,91,255,.45),
    0 0 120px rgba(120,80,255,.25);
}

.brand-icon {
  margin-left: 5px;
  font-size: 32px;
  filter: drop-shadow(0 0 6px rgba(160,100,255,.9));
  animation: iconPulse 2.4s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,100% { transform: scale(1); opacity: .9; }
  50% { transform: scale(1.15); opacity: 1; }
}

@keyframes cardPulse {
  0%,100% { box-shadow: 0 0 40px rgba(159,91,255,.45), 0 0 120px rgba(120,80,255,.25); }
  50%     { box-shadow: 0 0 52px rgba(159,91,255,.55), 0 0 160px rgba(120,80,255,.32); }
}
.login-container{
  box-shadow:
    0 0 18px rgba(255,255,255,.35),
    0 0 40px rgba(255,255,255,.18),
    0 0 60px rgba(159,91,255,.45),
    0 0 140px rgba(120,80,255,.3);

  animation: cardPulse 3.6s ease-in-out infinite;
}
.login-title-gradient:hover{
  filter: drop-shadow(0 0 14px rgba(108,240,255,.55)) drop-shadow(0 0 22px rgba(159,91,255,.65));
  transform: translateY(-1px);
  transition: .2s ease;
}
.brand_mark{
  display:flex;
  align-items:center;
  gap:8px;
  letter-spacing:.5px;
}


/* ===== Autofill 统一暗色风格（浏览器保存密码） =====
   说明：Chrome/Edge 会把 input 本身刷成白色，需要直接覆盖 .el-input__inner 的 :-webkit-autofill。
*/
.login-container .el-input__inner{
  background: transparent !important;
  color: #fff;
  caret-color: #fff;
}

/* Chrome / Edge / Safari */
.login-container .el-input__inner:-webkit-autofill,
.login-container .el-input__inner:-webkit-autofill:hover,
.login-container .el-input__inner:-webkit-autofill:focus,
.login-container .el-input__inner:-webkit-autofill:active{
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #ffffff !important;
  border-radius: 10px;
  /* 关键：用超大 inset 覆盖浏览器填充的白底 */
  -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.10) inset !important;
  box-shadow: 0 0 0 1000px rgba(255,255,255,0.10) inset !important;
  transition: background-color 9999s ease-out 0s;
}

/* 聚焦时加强（白光 + 紫光） */
.login-container .el-input__inner:-webkit-autofill:focus{
  -webkit-box-shadow:
    0 0 0 1000px rgba(255,255,255,0.14) inset,
    0 0 10px rgba(255,255,255,0.35),
    0 0 22px rgba(159,91,255,0.45) !important;
  box-shadow:
    0 0 0 1000px rgba(255,255,255,0.14) inset,
    0 0 10px rgba(255,255,255,0.35),
    0 0 22px rgba(159,91,255,0.45) !important;
}

/* 有些浏览器会对 wrapper 也做处理，这里兜底 */
.login-container .el-input__wrapper:has(input:-webkit-autofill){
  background: rgba(255,255,255,0.06) !important;
}

/* Firefox */
.login-container input:-moz-autofill{
  box-shadow: 0 0 0 1000px rgba(255,255,255,0.10) inset !important;
  -moz-text-fill-color: #fff !important;
  color: #fff !important;
}

</style>




<style lang="scss">
/* ===== 全局兜底：解决 Chrome 自动填充把输入框刷成白色（scoped 有时命中不到） ===== */
.login-bg {
  .el-input__wrapper{
    background: rgba(255,255,255,.06) !important;
    border: 1px solid rgba(138,43,226,.35) !important;
    box-shadow: none !important;
  }
  input.el-input__inner{
    background: transparent !important;
    color: #fff !important;
    caret-color: #fff !important;
  }

  /* Chrome / Edge */
  input.el-input__inner:-webkit-autofill,
  input.el-input__inner:-webkit-autofill:hover,
  input.el-input__inner:-webkit-autofill:focus,
  input.el-input__inner:-webkit-autofill:active{
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff !important;
    /* 用深紫反刷白底（比淡白 inset 更稳） */
    -webkit-box-shadow: 0 0 0 1000px rgba(20,6,42,.92) inset !important;
    box-shadow: 0 0 0 1000px rgba(20,6,42,.92) inset !important;
    border-radius: 10px !important;
    transition: background-color 9999s ease-out 0s;
  }

  /* 有些情况下白底来自 wrapper 的变量色，这里再兜底一层 */
  .el-input__wrapper:has(input.el-input__inner:-webkit-autofill){
    background: rgba(255,255,255,.06) !important;
  }
}
</style>
