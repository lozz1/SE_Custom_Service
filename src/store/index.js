import { createStore } from 'vuex';
import userModule from'./modules/loggeduser.js'

const store = createStore({
    modules:{
        userModule,
    },
   
})

export default store;