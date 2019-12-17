<template>
  <div class="login">
    <div class="waveWrapper waveAnimation">
      <div class="waveWrapperInner bgTop">
        <div class="wave waveTop"></div>
      </div>
      <div class="waveWrapperInner bgMiddle">
        <div class="wave waveMiddle"></div>
      </div>
      <div class="waveWrapperInner bgBottom">
        <div class="wave waveBottom"></div>
      </div>
    </div>
    <div class="card">
        <!-- <img style="width: 280px;margin: 40px auto;display: block;" src="@/assets/logo/login_logo.png" alt=""> -->
        <div style="width: 100%; height: 100px;font-size: 26px;line-height: 100px;text-align: center">登录</div>
      <dl>
        <dd style="margin-bottom: 35px">
          <el-input type="text"
                    autofocus
                    @focus="error_msg = ''"
                    v-model.trim="username"
                    clearable placeholder="请输入内容">
                    <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </dd>
        <dd>
          <el-input type="password"
                    @focus="error_msg = ''"
                    autofocus
                    placeholder="请输入密码"
                    clearable
                    v-model.trim="password" show-password>
                    <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </dd>
        <span class="err_msg">
          <i v-if="error_msg" class="el-icon-info" style="color: #F33232;"></i>
          {{error_msg}}
        </span>
        <dd style="margin-top: 40px">
          <span class="button" @click="submit">登录</span>
        </dd>
      </dl>
    </div>
    <div style="z-index: 21;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    font-size:13px">
       版权所有©2016 - 2019 | 西安麦仓数据服务有限公司 |
      <a style="color: #777;text-decoration: none" href="http://beian.miit.gov.cn"
         target="_blank">陕ICP备17018521号-2</a>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'index',
  data () {
    return {
      username: '',
      password: '',
      error_msg: ''
    }
  },
  created () {

  },
  methods: {
    submit () {
      if (this.username && this.password) {
        const data = {
          userName: this.username,
          passWord: md5(this.password + 'tax')
        }
        this.$store.dispatch('Login', data)
          .then((response) => {
            if (response.code === 200) {
              this.$router.push({ path: '/' })
              console.log(1111)
            } else {
              this.error_msg = response.msg
            }
          })
          .catch(() => {
          })
      } else {
        this.error_msg = '账号或密码不能为空'
      }
      console.log('提交')
    }
  }
}
</script>

<style lang="less">
.login {
  height: 100%;
  width: 100%;
  background-color: #F6F7FA;
  @keyframes move_wave {
    0% {
      transform: translateX(0) translateZ(0) scaleY(1)
    }
    50% {
      transform: translateX(-25%) translateZ(0) scaleY(0.55)
    }
    100% {
      transform: translateX(-50%) translateZ(0) scaleY(1)
    }
  }
  .waveAnimation {
  }
  .waveWrapper {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    .waveWrapperInner {
      position: absolute;
      width: 100%;
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-image: linear-gradient(to top, #fff 40%, #fff 60%);
      .wave {
      }
      .waveTop {
      }
    }
    .bgTop {
      z-index: 15;
      opacity: 0.5;
    }
    .waveWrapperInner {
      .wave {
      }
      .waveMiddle {
      }
    }
    .bgMiddle {
      z-index: 10;
      opacity: 0.75;
    }
    .waveWrapperInner {
      .wave {
      }
      .waveBottom {
      }
    }
    .bgBottom {
      z-index: 5;
    }
    .wave {
      position: absolute;
      left: 0;
      width: 200%;
      height: 100%;
      background-repeat: repeat no-repeat;
      background-position: 0 bottom;
      transform-origin: center bottom;
    }
    .waveTop {
      background-size: 50% 150px;
      background-image: url('../../../public/wave/1.png')
    }
    .waveMiddle {
      background-size: 50% 200px;
      background-image: url('../../../public/wave/2.png')
    }
    .waveBottom {
      background-size: 50% 180px;
      background-image: url('../../../public/wave/3.png')
    }
  }
  div {
    a {
    }
  }
  .waveAnimation .waveTop {
    animation: move-wave 3s;
    -webkit-animation: move-wave 3s;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }
  .waveAnimation .waveMiddle {
    animation: move_wave 10s linear infinite;
  }
  .waveAnimation .waveBottom {
    animation: move_wave 15s linear infinite;
  }
  .card {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 450px;
    width: 380px;
    z-index: 20;
    box-shadow:0px 2px 9px 2px rgba(13,18,30,0.31);
    border-radius:4px;
    background-color: #fff;
    div {
    }
    dl {
      dd {
        .el-input__icon {
        }
        .el-icon-user {
        }
      }
      dd {
        .el-input__icon {
        }
        .el-icon-lock {
        }
      }
      .err_msg {
        .el-icon-info {
        }
      }
      dd {
        .button {
        }
      }
    }
    dd {
      text-align: center;
      .el-input {
        width: 300px;
        .el-input__icon {
          font-size: 18px;
        }
      }
      .button {
        display: block;
        margin: 0 auto;
        width:300px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background:rgba(67,120,255,1);
        border-radius:3px;
        color: #fff;
        cursor: pointer;
      }
    }
    .err_msg {
      position: relative;
      font-size: 12px;
      color: #7A7B7F;
      left: 42px;
      line-height: 36px;
    }
  }
}
</style>
