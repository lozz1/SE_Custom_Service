<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

  <div class="chat_interface" style="width:100% height:100%">
    <aside>
      <div class="question-layout">
        <button class="col-8"
          style="margin: 0 6px;max-width: 80%;border-radius: 12px;padding: 8px;text-align: center;font-size: 16px;"
          @click="newQuestion">
          <p>新增问题</p>
        </button>
        <div v-for="(item, index) in questionList" :key="index" class="question-item" ref="question-item">
          <button class="col-11">
            <p class="question questionBg"> <img src="../assets/chat.svg" width="14" height="14" />
              {{ item }}
            </p>
          </button>
        </div>
      </div>
    </aside>

    <div class="chat-box" ref="chatBox">
      <div v-for="(item, index) in messageList" :key="index" class="chat-item">
        <div v-if="item.name === name" class="chat-msg mine">
          <p class="msg mineBg">{{ item.txt }}</p>
          <p class="user" :style="{ background: bg }">
            {{ item.name.substring(item.name.length - 5, item.name.length) }}
          </p>
        </div>
        <div v-else class="chat-msg other">
          <p class="user" :style="{ background: item.bg }">
            {{ item.name.substring(item.name.length - 5, item.name.length) }}
          </p>
          <p class="msg otherBg">{{ item.txt }}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <textarea placeholder="请输入问题..." v-model="textValue" autofocus ref="texta" @keyup.enter="send"></textarea>

      <div class="send-box">
        <p class="send active" @click="send">发送</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, reactive, nextTick, onUpdated } from "vue";

import axios from "axios";

export default {
  name: "ChatRoom",
  setup() {
    let socket = null;
    const path = "wss://yejsgk.top/back/demo2/chat/patient";
    const textValue = ref("");
    const chatBox = ref(null);
    const texta = ref(null);
    const name = new Date().getTime().toString();
    const bg = randomRgb();
    const messageList = reactive([]);
    const questionList = reactive([]);

    // WebSocket初始化
    function init() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        socket = new WebSocket(path);
        socket.onopen = open;
        socket.onerror = error;
        socket.onclose = closed;
        socket.onmessage = getMessage;
        window.onbeforeunload = function (e) {
          e = e || window.event;
          if (e) {
            e.returnValue = "关闭提示";
            socket.close();
          }
          socket.close();
          return "关闭提示";
        };
      }
    }

    function open() {
      alert("socket连接成功");
    }

    function error() {
      alert("连接错误");
    }

    function closed() {
      alert("socket关闭");
    }


    // 监听信息
    async function getQuestionList(msg) {
      var url = "https://yejsgk.top/back/demo2/api/patient/chatroom/get/titles"
      axios.get(url)
        .then((response) => {
          console.log(response)
        })
      // const obj = JSON.parse(msg.data);
      // questionList.push(obj);
      // await nextTick();
      // chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }

    async function getMessage(msg) {
      const obj = JSON.parse(msg.data);
      messageList.push(obj);
      await nextTick(); // 异步更新DOM
      chatBox.value.scrollTop = chatBox.value.scrollHeight; // 保持滚动条在底部
    }
    // 随机获取头像背景
    function randomRgb() {
      let R = Math.floor(Math.random() * 130 + 110);
      let G = Math.floor(Math.random() * 130 + 110);
      let B = Math.floor(Math.random() * 130 + 110);
      return "rgb(" + R + "," + G + "," + B + ")";
    }
    // 发送消息
    function send() {
      if (textValue.value.trim().length > 0) {
        const obj = {
          name: name,
          txt: textValue.value,
          bg: bg,
        };
        // socket.send(JSON.stringify(obj));
        messageList.push(obj);
        textValue.value = "";
        texta.value.focus();
      }
    }

    function newQuestion() {
      questionList.unshift("新的问题");
    }

    function close() {
      alert("socket已经关闭");
    }

    onUpdated(() => {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    });

    onMounted(() => {
      init();
      getQuestionList();
      questionList.push("最近有点头疼");
      questionList.push("腰疼");
      questionList.push("眼睛胀痛");
    });

    onUnmounted(() => {
      // socket.onclose = close;
    });

    return {
      send,
      textValue,
      questionList,
      messageList,
      name,
      bg,
      chatBox,
      texta,
      randomRgb,
      newQuestion
    };
  },
};
</script>

<style scoped>
html,
body {
  background-color: #e8e8e8;
  user-select: none;
}

aside {
  display: flex;
  flex-direction: column;
  width: 280px;
  margin: 0px;
  min-height: 100vh;
  overflow: hidden;
  padding: 1rem;

  background-color: #777799;
  color: var(--light);

  transition: 0.2s ease-out;

  @media (max-width: 1920px) {
    position: fixed;
    z-index: 99;
  }
}

::-webkit-scrollbar {
  width: 20px;
  height: 8px;
  display: relative;
}

::-webkit-scrollbar-thumb {
  background-color: #D1D1D1;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  border-left: 2px solid transparent;
  border-top: 2px solid transparent;
}

* {
  margin: 0;
  padding: 0;
}

.mine {
  justify-content: flex-end;
}

.other {
  justify-content: flex-start;
}

.mineBg {
  background: #98e165;
}

.otherBg {
  background: #fff;
}

.home {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  min-width: 360px;
  min-height: 430px;
  box-shadow: 0 0 24px 0 rgb(19 70 80 / 25%);
}

.count {
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #EEEAE8;
  font-size: 16px;
}


.chat_interface {
  display: grid;
  grid-template-columns: auto;
  gap: 0px;
  grid-auto-rows: minmax(100px, auto);
}

.chat-box {
  grid-column: 2/7;
  width: 100%;
  height: 800px;
  background-color: #f4f4f4;
  overflow: auto;
}

.footer {
  grid-column: 2/7;
  grid-row: 2;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.footer textarea {
  grid-column: 2/7;
  width: 100%;
  height: 100%;
  background: #ffe2e2;
  border: 0;
  box-sizing: border-box;
  resize: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
}

.send-box {
  display: flex;
  height: 40%;
  justify-content: flex-end;
  align-items: center;
}

.send {
  margin-right: 20px;
  cursor: pointer;
  border-radius: 3px;
  background: #f5f5f5;
  z-index: 21;
  font-size: 16px;
  padding: 8px 20px;
}

.send:hover {
  filter: brightness(110%);
}

.active {
  background: #98e165;
  color: #fff;
}

.chat-msg {
  display: flex;
  align-items: center;
}

.user {
  font-weight: bold;
  color: #fff;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 8px;
  text-align: center;
}

.question-layout {
  grid-column: 1/5;
}

.question {
  margin: 0 10px;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
  color: #020202;
  border-radius: 5px;
  padding: 10px;
  text-align: justify;
  text-overflow: ellipsis;
  font-size: 16px;
}

.question-item {
  margin: 5% 0;
  animation: up-down 1s both;
}

.msg {
  margin: 0 5px;
  max-width: 40%;
  white-space: normal;
  word-break: break-all;
  color: #333;
  border-radius: 8px;
  padding: 10px;
  text-align: justify;
  font-size: 16px;
  box-shadow: 0px 0px 10px #f4f4f4;
}

.chat-item {
  margin: 3.5% 0;
  animation: up-down 1s both;
}

@keyframes up-down {
  0% {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}
</style>