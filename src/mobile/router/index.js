import Vue from 'vue'
import Router from 'vue-router'
import yuansferme from '../pages/yuansferme/index'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'yuansferme',
            component: yuansferme
        }
    ]
})
