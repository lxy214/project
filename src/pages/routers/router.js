import Vue from 'vue'
import Router from 'vue-router'
import { LoginConfig } from '../containers/login/app'
Vue.use(Router);
export default new Router({
  routes: [
    ...LoginConfig,
  ]
})
