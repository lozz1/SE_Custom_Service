<template>
  <div class="question-layout">
    <div v-for="(item, index) in questionList" :key="index" class="question-item" ref="question-item">
      <p class="question questionBg"> <span><img src="./assets/chat.svg" width="14" height="14" /></span>
        {{ item }}
      </p>
    </div>
  </div>
</template>


<script>

export default {
  setup() {
    const questionList = reactive([]);

    onMounted(() => {
      // init();
      questionList.push("最近有点头疼");
      questionList.push("腰疼");
      questionList.push("眼睛胀痛");
    });

    return {
      questionList,
    };
  },
};


</script>
