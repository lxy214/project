import Vue from 'vue'
import router from './pages/routers/router';
import App from './app.vue';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import axios from 'axios'

Vue.prototype.$ajax = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
const root = document.createElement('div');
document.body.appendChild(root);
new Vue({
  render: h => h(App),
  components: { App },
  router,
  template: '<App/>'
}).$mount(root);
