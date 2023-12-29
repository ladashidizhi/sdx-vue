<template>
  <div id="login">
    <div id="login_background"></div>
    <div class="login_content">
      <h2 class="title">闪电侠登录</h2>
      <div class="form_item">
        <div class="icon">
          <icon-user-group />
        </div>
        <div class="textarea">
          <input type="text" 
                 placeholder="用户名" 
                 v-model="username.value"
                 @focus="username.focus=true"
                 @blur="username.focus=false"
                  />
        </div>
        <div class="line button_user_line" 
             :style="{'transform': username.focus ? '' : 'scaleX(0)'}"></div>
      </div>
      <div class="form_item">
        <div class="icon pwd">
          <icon-lock />
        </div>
        <div class="textarea pwd">
          <input type="password" 
                 v-model="password.value"
                 placeholder="密码" 
                 @focus="password.focus=true"
                 @blur="password.focus=false"
                  />
        </div>
        <div class="line button_pwd_line" 
             :style="{'transform': password.focus ? '' : 'scaleX(0)'}"></div>
      </div>
      <div class="login_button" @click="login">
        <div>登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { ref, reactive } from 'vue';
import CLOUDS from 'vanta/dist/vanta.clouds.min'

import { Login } from '@/api/login/index'

import { useUsersStore } from '@/store/user.js'

export default {
    name: "Login",
    setup(){
      const userStore = useUsersStore()

      const date = new Date()
      const CloudConfig = ref({
        Light:{
          backgroundColor: 0x00000,
          cloudShadowColor:0x183550,
          skyColor: 0x68b8d7,
          cloudColor: 0xd7d7eb,
          sunColor:0xff9919,
          sunGlareColor:0x7f7c7c,
          sunlightColor:0xff9933,
        },
        Night:{
          backgroundColor: 0x0,
          skyColor: 0x3e3e41,
          cloudColor: 0x626275,
          cloudShadowColor: 0x0,
          sunColor: 0x525252,
          sunGlareColor: 0x0,
          sunlightColor: 0x0,
        }
      })

      // 
      const CloudCompoment = null
      const CloudCompomentInterVal = null
      const DarkMode = !(date.getHours() >= 18 || date.getHours() <= 7) // 暗夜深色模式

      //
      const username = reactive({ // 用户名
        value: "",
        focus: false
      }), password = reactive({ // 密码
        value: "",
        focus: false
      })

      return { 
        CloudConfig, 
        CloudCompoment, 
        CloudCompomentInterVal, 
        DarkMode,
        username,
        password,
        userStore
      }
    },
    methods:{
      async login(e){
        if(e){
          if(e.keyCode !== 13){
            return
          }
        }
        if(this.username.value.trim().length === 0){
          this.$message.error("请正确填写用户名")
        }else if(this.password.value.trim().length === 0){
          this.$message.error("请正确填写密码")
        }else{
          const result = await Login(this.username.value, this.password.value)
          if(result.code === 7){
            this.$message.error("用户名或密码错误")
          }else{
            this.$message.success("登录成功")
            this.userStore.setUserInfo(result.data)
            this.$router.push("/home")
          }
        }
      },
      updateCloud(date = new Date(), focus=false){
        const darkMode = date.getHours() >= 18 || date.getHours() <= 7
        if(darkMode === this.DarkMode && !focus){
            return
        }
        this.DarkMode = darkMode
        const config = darkMode ? this.CloudConfig.Night : this.CloudConfig.Light
        try{
          this.CloudCompoment.destroy()
        }catch(e){
        }
        this.CloudCompoment = CLOUDS({
          THREE,
          el:"#login",
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200.00,
          minWidth: 200.00,
          ...config,
          speed: 3
        })
      }
    },
    mounted(){
      window.addEventListener('keydown', this.login)
      this.updateCloud()
      this.CloudCompomentInterVal = setInterval(()=>{
        this.updateCloud()
      }, 5000)
    },
    beforeUnmount(){
      window.removeEventListener('keydown', this.login)
      clearInterval(this.CloudCompomentInterVal)
      this.CloudCompoment.destroy()
    }
}
</script>

<style lang="scss" scoped>
 #login{
  width: 100%;
  height: 100%;
  #login_background{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 5;
  }
  .login_content{
    width: 550px;
    height: 450px;
    position: fixed;
    left: calc(50% - 550px / 2);
    top: calc(50% - 450px / 2);
    z-index: 10;
    border-radius: 5px;
    background: rgba(255,255,255, 0.1);
    backdrop-filter: blur(15px);
    padding: 30px;
    box-sizing: border-box;

    .title{
      width: 100%;
      text-align: center;
      font-size: 26px;
      user-select: none;
      background-image: linear-gradient(to right, #d31146, gold);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form_item{
      display: flex;
      width: 80%;
      margin: 0px auto;
      height: 45px;
      margin-top: 30px;
      margin-bottom: 45px;
      position: relative;
      border-bottom: 1px solid white;
      justify-content: space-between;

      .icon{
        width: 45px;
        height: 45px;
        font-size: 32px;
        text-align: center;
        line-height: 45px;
        color: #d31146;
      }

      .textarea{
        width: 87%;
        input{
          width: 100%;
          height: 45px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 18px;
          font-weight: 800;
          color: #d31146;
          &::selection{
            background: #d31146;
            color: white;
          }
          &::-webkit-input-placeholder { /* Firefox 19+ */
            color: #909399;
          }
        }
      }

      .line{
        width: 100%;
        position: absolute;
        border: none;
        height: 1px;
        background-color: #d31146;
        transition: all .4s;
        left: 0;
        bottom: -1px;
      }

      .button_pwd_line{
        background-color: rgb(255, 150, 38);
      }

      .pwd{
        color: rgb(255, 150, 38);
        input{
          color: rgb(255, 150, 38);
          &::selection{
            background: rgb(255, 150, 38);
            color: white;
          }
        }
      }
    }

    .login_button{
      width: 80%;
      height: 50px;
      margin: 65px auto;
      color: white;
      text-align: center;
      line-height: 50px;
      border-radius: 1000px;
      font-size: 18px;
      position: relative;
      cursor: pointer;
      transition: all .3s ease-in-out;
      background: linear-gradient(to right, #d31146, rgb(255, 150, 38));
      animation: flash 10s infinite alternate;

      @keyframes flash {
        0%{
          background: rgb(255, 150, 38);
          box-shadow: 0 0 20px rgb(255, 150, 38);
        }

        50%{
          background: #d31146;
          box-shadow: 0 0 10px #d31146;
        }

        75%{
          background: darkred;
          box-shadow: 0 0 15px darkred;
        }

        100%{
          background: darkgoldenrod;
          box-shadow: 0 0 5px darkgoldenrod;
        }
      }
      div{
        position: absolute;
        letter-spacing: 8px;
        left: calc(50% - 52px / 2);
        font-weight: 400;
        user-select: none;
      }
    }
  }
}
</style>