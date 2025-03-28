export default {
    template: `
    <div class="container mt-5">
        <h3>Create Your Professional Account</h3>
        <form @submit.prevent="registerProfessional">
            <div class="mb-3">
                <label for="full_name" class="form-label">Full Name</label>
                <input v-model="formData.full_name" type="text" class="form-control" id="full_name" required />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input v-model="formData.email" type="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input v-model="formData.password" type="password" class="form-control" id="password" required />
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <input v-model="formData.address" type="text" class="form-control" id="address" required />
            </div>
            <div class="mb-3">
                <label for="pincode" class="form-label">Pincode</label>
                <input v-model="formData.pincode" type="text" class="form-control" id="pincode" required />
            </div>
            <div class="mb-3">
                <label for="experience" class="form-label">Experience (in years)</label>
                <input v-model="formData.experience" type="number" class="form-control" id="experience" required />
            </div>
            <div class="mb-3">
            <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input v-model="formData.phone" type="text" class="form-control" id="phone" required />
            </div>
                <label for="service_name" class="form-label">Service Name</label>
                <select v-model="formData.service_name" class="form-select" id="service_name" required>
                    <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="document" class="form-label">Upload Document (Optional)</label>
                <input type="file" class="form-control" id="document" @change="handleFileUpload" />
            </div>
            <button type="submit" class="btn btn-primary">Sign Up</button>
            <div class="mt-3">
          <p>Already have an account? <router-link to="/login">Login here</router-link>.</p>
        </div>
        </form>
    </div>
    `,
    data() {
        return {
            services: [],
            formData: {
                "full_name": null,
                "email": null,
                "password": null,
                "address": null,
                "pincode": null,
                "experience": null,
                "phone":null,
                "service_name": null,
                "document": null,
            },
        };
    },
    mounted() {
        this.fetchServices();
    },
    methods: {
        async fetchServices() {
            try {
                const response = await fetch('/api/services');
                this.services = await response.json();
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        },
        handleFileUpload(event) {
            this.formData.document = event.target.files[0];
        },
        async registerProfessional() {
            try {
            
                const response = await fetch("/register-professional", {
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
        },
    },
};
