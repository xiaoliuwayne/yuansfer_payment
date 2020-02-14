// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _global from '@/common/globalValue'
import i18n from '@/language/index'
// vant 国际化
import {
    Locale,
    Button,
    Field,
    Cell,
    CellGroup,
    RadioGroup,
    Radio,
    Dialog,
    Loading,
    Toast,
    Icon
} from 'vant'
import enUS from 'vant/lib/locale/lang/en-US'
// 自动按需引入
Locale.use('en-US', enUS)
Vue.use(Button)
Vue.use(Field)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(Loading)
Vue.use(Toast)
Vue.use(Icon)

Vue.prototype.GLOBAL = _global

Vue.config.lang = 'zh-cn'
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
    el: '#app',
    i18n,
    router,
    components: { App },
    template: '<App/>'
})
