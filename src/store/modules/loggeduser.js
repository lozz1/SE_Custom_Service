// 存储当前登录的病患和客服聊天的数据
export default {

  namespaced: true,
  state() {
    return {
      PatientId: null,
      ServiceId: null,
    };
  },

  mutations: {
    setPatientId(state, payload) {
      state.PatientId = payload.PatientId;
      //console.log(state.loggedUserId)
    },
    setServiceId(state, payload) {
      state.ServiceId = payload.ServiceId;

    }
  },

  actions: {
    addPatientId(context, payload) {
      context.commit('setPatientId', payload)
    },
    
    addServiceId(context, payload) {
      context.commit('setServiceId', payload)
    }

  },

  getters: {
    getPatientId(state) {
      return state.PatientId;
    },
    getServiceId(state) {
      return state.ServiceId;
    },


  }

}