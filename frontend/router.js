import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Professional_Signup from "./components/signup_professional.js"
import Customer_Signup from "./components/signup_customer.js"

const routes = [
    {path:'/', component : Home, name:'Home'},
    {path:'/login', component:Login, name:'Login'},
    {path:'/signup-professional', component:Professional_Signup, name:'Signup_p'},
    {path:'/signup-customer', component:Customer_Signup, name:'Signup_c'}
]


export default new VueRouter({
    routes
})