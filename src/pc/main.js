// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _global from '@/common/globalValue'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from '@/language/index'
import {
    Button,
    Select,
    Container,
    Header,
    Main,
    Row,
    Col,
    Form,
    FormItem,
    Input,
    InputNumber,
    Message
} from 'element-ui'

Vue.prototype.GLOBAL = _global

Vue.config.lang = 'zh-cn'
Vue.config.productionTip = false

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.prototype.$message = Message
/* eslint-disable no-new */

new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
