import { createStore } from 'vuex';
import userModule from'./modules/loggeduser.js'

const store = createStore({
    modules:{
        user:userModule,
    },
   
})

export default store;