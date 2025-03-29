import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Professional_Signup from "./components/signup_professional.js"
import Customer_Signup from "./components/signup_customer.js"
import Customer_Search from "./components/customer_components/CustomerSearch.js"
import Admin_Search from "./components/admin_components/AdminSearch.js"

const routes = [
    {path:'/', component : Home, name:'Home'},
    {path:'/login', component:Login, name:'Login'},
    {path:'/signup-professional', component:Professional_Signup, name:'Signup_p'},
    {path:'/signup-customer', component:Customer_Signup, name:'Signup_c'},
    {path:'/customer-search', component:Customer_Search},
    {path:'/admin-search', component:Admin_Search}
]


export default new VueRouter({
    routes
})