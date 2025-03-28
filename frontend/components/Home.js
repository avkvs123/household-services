import AdminHome from './admin_components/AdminHome.js'
import CustomerHome from './customer_components/CustomerHome.js'
import ProfessionalHome from './professional_components/ProfessionalHome.js'


const Home = {
    template: `<div>
    <CustomerHome v-if="user_role=='customer'"/>
    <ProfessionalHome v-if="user_role=='professional'"/>
    <AdminHome v-if="user_role=='admin'"/>
    
    </div>`,

    data(){
        return {
            user_role: this.$route.query['role']
        }
    },
    components: {
        AdminHome,
        CustomerHome,
        ProfessionalHome,
    }
};

export default Home;