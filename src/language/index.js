import Vue from 'vue'
import VueI18n from 'vue-i18n'
// element-ui国际化需要的
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// import ElementLocale from 'element-ui/lib/locale'
// 自定义的国际化对照文件
import myEnLocale from './en'
import myZhLocale from './zh'

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: localStorage.lang || 'zh',
    messages: {
        en: {
            ...enLocale,
            ...myEnLocale
        },
        zh: {
            ...zhLocale,
            ...myZhLocale
        }
    }
})
locale.i18n((key, value) => i18n.t(key, value)) // 重点：为了实现element插件的多语言切换

export default i18n
