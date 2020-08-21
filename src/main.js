import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

const eventBus = new Vue()
Vue.mixin({
    data: function () {
        return {
            eventBus: eventBus
        }
    }
});


new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
