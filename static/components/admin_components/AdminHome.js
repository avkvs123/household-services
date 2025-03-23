export default {
    template: `
    <div class="container mt-4">
        <h3>Services</h3>
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Service Name</th>
                    <th>Base Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="service in services" :key="service.id">
                    <td>{{ service.id }}</td>
                    <td>{{ service.name }}</td>
                    <td>Rs. {{ service.base_price }}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" @click="editService(service)">Edit</button>
                        <button class="btn btn-sm btn-danger" @click="deleteService(service.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="btn btn-success" @click="showAddServiceModal">Create New Service</button>

        <h3 class="mt-5">Professionals</h3>
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Experience</th>
                    <th>Service Name</th>
                    <th>Approved</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="professional in professionals" :key="professional.id">
                    <td>{{ professional.id }}</td>
                    <td>{{ professional.full_name }}</td>
                    <td>{{ professional.experience }} years</td>
                    <td>{{ professional.service_name }}</td>
                    <td>{{ professional.is_approved === null ? 'Pending' : professional.is_approved ? 'Yes' : 'No' }}</td>
                    <td>
                        <button class="btn btn-sm btn-success" v-if="!professional.is_approved" @click="approveProfessional(professional.id)">Approve</button>
                        <button class="btn btn-sm btn-secondary" v-else disabled>Approved</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <h3 class="mt-5">Service Requests</h3>
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Assigned Professional</th>
                    <th>Customer Name</th>
                    <th>Service Name</th>
                    <th>Requested Date</th>
                    <th>Closed Date</th>
                    <th>Status</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="request in serviceRequests" :key="request.id">
                    <td>{{ request.id }}</td>
                    <td>{{ request.assigned_professional || '' }}</td>
                    <td>{{ request.customer_name || '' }}</td>
                    <td>{{ request.service_name || '' }}</td>
                    <td>{{ request.requested_date || '' }}</td>
                    <td>{{ request.closed_date || '' }}</td>
                    <td>
                        <span class="badge" :class="{
                            'bg-warning': request.status === 'requested',
                            'bg-success': request.status === 'accepted',
                            'bg-secondary': request.status === 'closed'
                        }">
                            {{ request.status.capitalize() }}
                        </span>
                    </td>
                    <td>{{ request.rating || '' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    data() {
        return {
            services: [],
            professionals: [],
            serviceRequests: [],
            token: localStorage.get("auth-token")
        };
    },
    methods: {
        async fetchServices() {
            const response = await fetch('/api/services');
            this.services = await response.json();
        },
        async fetchProfessionals() {
            const response = await fetch('/professionals',{
                headers:{
                    "Authentication-Token": this.token
                },
            });
            this.professionals = await response.json();
        },
        async fetchServiceRequests() {
            const response = await fetch('/api/service-requests');
            this.serviceRequests = await response.json();
        },
        async deleteService(id) {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            this.fetchServices();
        },
        async approveProfessional(id) {
            await fetch(`/api/professionals/${id}/approve`, { method: 'POST' });
            this.fetchProfessionals();
        }
    },
    beforeMount() {
        this.fetchServices();
        this.fetchProfessionals();
        this.fetchServiceRequests();
    }
};
