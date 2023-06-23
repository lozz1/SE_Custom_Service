<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

  <div class="chat_interface" style="width:100% height:100%">
    <aside>
      <div class="question-layout">
        <button class="col-8"
          style="margin: 0 6px;max-width: 80%;border-radius: 12px;padding: 8px;text-align: center;font-size: 16px;"
          @click="asknewQuestion = true">
          <p>新增问题</p>
        </button>
        <el-dialog v-model="asknewQuestion" title="问题描述" :close-on-click-modal="true">
          <el-input type="textarea" v-model="new_title" @keyup.enter="newQuestion()" />
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="newQuestion(); asknewQuestion = false;">
                确认
              </el-button>
              <el-button @click="asknewQuestion = false">取消</el-button>
            </span>
          </template>

        </el-dialog>
        <div v-for="(item, index) in questionList" :key="index" class="question-item" ref="question-item">
          <button class="col-11" @click="getMessageList(item.chatId)">
            <p class="question"> <img src="../assets/chat.svg" width="14" height="14" />
              {{ item.title }}
            </p>
          </button>
        </div>
      </div>
    </aside>

    <div class="chat-box" ref="chatBox">
      <div v-for="(item, index) in messageList" :key="index" class="chat-item">
        <div v-if="item.from === self_type" class="chat-msg mine">
          <p class="msg mineBg">{{ item.content }}</p>
          <p class="user" :style="{ background: bg }">
            {{ name }}
          </p>
        </div>
        <div v-else class="chat-msg other">
          <p class="user" :style="{ background: item.bg }">
            {{ "service" }}
          </p>
          <p class="msg otherBg">{{ item.content }}</p>
        </div>
      </div>
    </div>

    <div class="footer" v-if="currentChatId !== ''">
      <textarea placeholder="请输入问题..." v-model="textValue" autofocus ref="texta" @keyup.enter="send"></textarea>

      <div class="send-box">
        <p class="send active" @click="send">发送</p>
        <!-- Button trigger modal -->
        <p class="send active" @click="ShowForm = true">完成</p>

        <el-dialog v-model="ShowForm" title="请给服务评分" :close-on-click-modal="true">
          <span class="ml-3 w-35 text-gray-600 inline-flex items-center">评分分数从0到5：</span>
          <el-input type="text" v-model="star" @keyup.enter="Feedback()" />
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="Feedback(); ShowForm = false;">
                确认
              </el-button>
              <el-button @click="ShowForm = false">取消</el-button>
            </span>
          </template>

        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, reactive, onUpdated, computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "ChatRoom",
  setup() {
    const store = useStore()
    let socket = null;
    const path = "wss://yejsgk.top/back/demo2/chat/patient";
    const textValue = ref(""); // 输入框文本内容
    const chatBox = ref(null); // 聊天室主体
    const texta = ref(null);
    const bg = randomRgb();  // 随机头像颜色
    const name = computed(() => store.getters['userModule/getPatientId']); // Vuex获取登录用户的ID
    const self_type = computed(() => store.getters['userModule/getType']);  // Vuex获取登录用户的类型
    let messageList = reactive([]);   // 存储当前聊天室聊天内容
    let questionList = reactive([]);  // 存储问题列表，string对象
    let title_id_map = reactive(new Map()); // 应对服务器发送的 UndoneChatId，映射: [questionList_index, chatid]
    let undoneChatId = '';  // 存储当前 UndoneChatId
    let currentChatId = '';
    let new_title = ref(''); // 存储新增问题时的问题描述
    let ShowForm = ref(false); // 评分弹窗显示
    let star = ref(''); // 存储评分
    let asknewQuestion = ref(false) // 新增问题弹窗显示

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

    // 获取问题列表
    async function getQuestionList() {
      var url = "https://yejsgk.top/back/demo2/api/patient/chatroom/get/titles"
      axios.get(url)
        .then((response) => {
          var question_list_json = response.data.content
          if (response.data.state == 1) {
            for (let i = 0; i < question_list_json.length; i++) {
              questionList.push(question_list_json[i])
              title_id_map.set(question_list_json[i].chatId, i)
            }
          }
        })
    }

    // 获取某个问题下的消息列表
    async function getMessageList(id) {
      currentChatId = id
      messageList.splice(0, messageList.length)
      var url = "https://yejsgk.top/back/demo2/api/patient/chatroom/get/content"
      await axios.get(url, {
        params: {
          id: id
        }
      })
        .then((response) => {
          console.log(response)
          var state = response.data.state
          if (response.data.state == 1) {
            var MessageList = response.data.content
            console.log(MessageList)
            for (let i = 0; i < MessageList.length; i++) {
              messageList.push(MessageList[i])
            }
          }
        })
    }

    // 获取服务器发送的消息：
    // - UndoneChatId
    // - 客服发送消息
    async function getMessage(msg) {
      var msg_data = JSON.parse(msg.data)
      if (msg_data.type == 1) {
        // 客服发送消息
        var chatId = msg_data.chatId;
        if (this.undoneChatId == chatId) {
          var row = {
            type: msg.type,
            id: chatId,
            msg: data.text,
            time: data.time,
          }
          this.MessageList.push(row)
        } else {
          // 发送未结束问题id
          var undone_chat_id = msg_data.data
          undoneChatId = undone_chat_id
          var question_id = title_id_map.get(undone_chat_id)
          const not_done_question = questionList.splice(question_id, 1)[0]
          questionList.unshift(not_done_question)
        }
      }
    }

    // 随机获取头像背景
    function randomRgb() {
      let R = Math.floor(Math.random() * 130 + 110);
      let G = Math.floor(Math.random() * 130 + 110);
      let B = Math.floor(Math.random() * 130 + 110);
      return "rgb(" + R + "," + G + "," + B + ")";
    }

    // 获取时间函数
    function getTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedTime;
    }

    // 病人发送消息
    async function send() {
      // 消息不为空，且有未结束问题
      if (textValue.value.trim().length > 0 & this.undoneChatId !== '' & this.undoneChatId === this.currentChatId) {
        const formattedTime = getTime();
        const show_obj = {
          content: textValue.value,
          from: "patient",
          time: formattedTime,
          to: "service"
        };
        const send_obj = {
          type: 1,
          id: undoneChatId,
          msg: textValue.value,
          time: formattedTime,
        };
        var send_obj_json = JSON.stringify(send_obj)
        console.log(send_obj)
        // socket.send(send_obj_json);
        messageList.push(show_obj);
        textValue.value = "";
        texta.value.focus();
      }
    }

    // 新增问题
    async function newQuestion() {
      var url = "https://yejsgk.top/back/demo2/api/patient/chatroom/upload/new-chat"
      var formattedTime = getTime();
      console.log(new_title)
      await axios.post(url, {
        content: new_title.value,
        time: formattedTime,
      })
        .then((response) => {
          console.log(response);
          var response_data = response.data
          if (response_data.state == 0) {
            alert("还有问题没有结束")
          }
          else if (response_data.state == 1 && response_data.content == null) {
            alert("当前没有客服在线")
          }
          else {
            new_title = ''
            getQuestionList()
            undoneChatId = response_data.content
            messageList.splice(0, messageList.length)
          }

        }).catch((erorr) => {
          console.log(error)
        })
    }

    // 评分并关闭问题
    async function Feedback() {
      console.log("call ChatDone")
      var url = "https://yejsgk.top/back/demo2/api/patient/chatroom/delete/chat"
      var formattedTime = getTime();
      await axios.post(url, {
        content: star.value,
        time: formattedTime,
      })
        .then((response) => {
          console.log(response);
          var response_data = response.data
          if (response_data.state == 0) {
            alert("failed")
          }
          else {
            console.log("delete success")
            star = ''
            undoneChatId = ''
            currentChatId = ''
            messageList.splice(0, messageList.length)
            getQuestionList()
          }

        }).catch((erorr) => {
          console.log(error)
        })
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
    });

    onUnmounted(() => {
      socket.onclose = close;
    });

    return {
      textValue,
      questionList,
      messageList,
      name,
      self_type,
      currentChatId,
      undoneChatId,
      bg,
      chatBox,
      texta,
      asknewQuestion,
      ShowForm,
      star,
      new_title,
      send,
      randomRgb,
      newQuestion,
      getMessageList,
      Feedback,
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
  grid-column: 1/2;
  margin: 0px;
  height: 100%;
  overflow: hidden;
  padding: 1rem;

  background-color: #777799;

  transition: 0.2s ease-out;

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
  background: #70e7f0;
}

.otherBg {
  background: #f5e3e3;
}

.chat_interface {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(1, 1fr);
  /* gap: 0px; */
  /* grid-auto-rows: minmax(100px, auto); */
}

.chat-box {
  grid-column: 2/8;
  grid-row: 1/2;
  width: 100%;
  height: 800px;
  background-color: #f4f4f4;
  overflow: auto;
}

.footer {
  grid-column: 2/8;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.footer textarea {
  grid-column: 2/8;
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
  color: #1a1010;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 12px 0 rgba(38, 146, 92, 0.699);
  width: 70px;
  height: 60px;
  line-height: 60px;
  border-radius: 8px;
  text-align: center;
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

/* .el-button--text {
  margin-right: 15px;
} */

.dialog-footer button:first-child {
  margin-right: 10px;
}

.el-input {
  width: 150px;
}

.el-button {
  min-width: 50px;
  min-height: 40px;
}
</style>