export default {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">Household Services</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon navbar-brand"></span>
        </button>
        <div class="collapse navbar-collapse " id="navbarScroll">
        <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
            <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="role=='admin'">
                <router-link class="nav-link"  to="/admin-search">Search</router-link>
            </li> 
            <li class="nav-item" v-if="role=='customer'">
                <router-link class="nav-link"  to="/customer-search">Search</router-link>
            </li> 
            <li class="nav-item" v-if="is_login">
                <button class="nav-link" @click='logout'>Logout</button>
            </li>          
            
        </ul>
        </div>
    </div>
    </nav>
    `,
    data() {
        return {
            role: localStorage.getItem('role'),
            is_login: localStorage.getItem("auth-token")
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            localStorage.removeItem('task_id')
            localStorage.removeItem('download_count')
            this.$router.push({ path: '/login' })
        },
    },
}