import router from "./router.js"
import Navbar from "./components/Navbar.js"


 

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true:false) 
({name: 'Login'})
    else next()
})

new Vue({
    el:"#app",
    template: `<div>
    <Navbar :key='is_changed'/>
    <router-view /></div>`,
    router,
    components: {
        Navbar,
    },
    data:{
        is_changed:true,
    },
    watch:{
        $route(to, from){
            this.is_changed=!this.is_changed
        },


    },
})