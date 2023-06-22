// 存储当前登录的病患和客服聊天的数据
export default {

  namespaced: true,
  state() {
    return {
      PatientId: '',
      ServiceId: '',
      Type: '',
    };
  },

  mutations: {
    setPatientId(state, payload) {
      state.PatientId = payload.username;
      state.Type = 'patient'
      //console.log(state.loggedUserId)
    },
    setServiceId(state, payload) {
      state.ServiceId = payload.username;
      state.Type = 'service'
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
    getType(state) {
      return state.Type;
    }

  }

}