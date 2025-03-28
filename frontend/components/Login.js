export default {
    template:`
    <div  class="d-flex justify-content-center" style="margin-top:20vh">
        
        <div class="mb-3 p-5 bg-light">
        
        <label for="user-email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="user-email" placeholder="name@example.com"
        v-model="credential.email">

        <label for="user-password" class="form-label">Password</label>
        <input type="password" id="user-password" class="form-control"
        v-model="credential.password">
        <button type="button" class="btn btn-primary mt-2" @click='login' > Login </button>
        <div class="mt-2 text-danger">{{error}}</div>

        <div class="mt-3">
          <p>Register as Customer <router-link to="/signup-customer">Customer Registeration</router-link>.</p>
        </div>

        <div class="mt-3">
          <p>Register as Professional <router-link to="/signup-professional">Professional Registration</router-link>.</p>
        </div>


        </div>
    </div>
    `,
    data(){
        return {
            credential:{
                "email": null,
                "password": null
            },
            error: null,
        }
    },
    methods:{
        async login(){
            const result = await fetch('/user-login', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.credential)
            }
            )
            const response_data= await result.json()
            if (result.ok){
                console.log(response_data)
                this.user_role=response_data.role
                if (response_data.token){
                    localStorage.setItem('auth-token', response_data.token)
                    this.$router.push({path:'/', query:{role: response_data.role}})
                }
            }
            else{
                this.error = response_data.message
            }

        }
    }
}