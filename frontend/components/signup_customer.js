export default {
    template: `
      <div class="container mt-5">
        <h3>Create Your Customer Account</h3>
        <form @submit.prevent="registerCustomer">
          <div class="mb-3">
            <label for="full_name" class="form-label">Full Name</label>
            <input v-model="formData.full_name" type="text" class="form-control" id="full_name" required>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input v-model="formData.email" type="email" class="form-control" id="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="formData.password" type="password" class="form-control" id="password" required>
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <input v-model="formData.address" type="text" class="form-control" id="address" required>
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input v-model="formData.phone" type="text" class="form-control" id="phone" required>
          </div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
        <div class="mt-3">
          <p>Already have an account? <router-link to="/login">Login here</router-link>.</p>
        </div>
      </div>
    `,
  
    data() {
      return {
        formData: {
            "full_name": null,
            "email": null,
            "password": null,
            "address": null,
            "phone": null
        }
      };
    },
  
    methods: {
      async registerCustomer() {
        try {
          const response = await fetch("/register-customer", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formData),
          });
  
          const data = await response.json();
          alert(data.message);
          this.$router.push({path:'/login'})
        } catch (error) {
          console.error("Registration failed:", error);
          alert("Failed to register");
        }
      }
    }
  };
  