export default {
    template: `
    <div><div class="container mt-4">
    <h2>Welcome Customer</h2>

    <div class="accordion" id="customerAccordion">
        <!-- Available Services Section -->
        <div class="accordion-item">
            <h2 class="accordion-header" id="servicesHeading">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#servicesCollapse">
                    Available Services
                </button>
            </h2>
            <div id="servicesCollapse" class="accordion-collapse collapse show" data-bs-parent="#customerAccordion">
                <div class="accordion-body">
                    <div class="row">
                        <div class="col-md-4" v-for="service in services" :key="service.id">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">{{ service.name }}</h5>
                                    <p class="card-text">{{ service.description }}</p>
                                    <button class="btn btn-primary" @click="openModal">View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Service Details Modal -->
        <div class="modal fade" id="serviceModal" tabindex="-1" aria-labelledby="serviceModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="serviceModalLabel">Service Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="service">
                            <h3>{{ service.name }}</h3>
                            <p>{{ service.description }}</p>
                            <p><strong>Base Price:</strong> {{ service.base_price }}</p>

                            <h4>Available Professionals</h4>
                            <div v-if="professionals.length > 0">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Experience</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="prof in professionals" :key="prof.id">
                                            <td>{{ prof.full_name }}</td>
                                            <td>{{ prof.email }}</td>
                                            <td>{{ prof.pincode }}</td> <!-- Assuming pincode stores contact -->
                                            <td>{{ prof.experience || 'N/A' }}</td>
                                            <td>
                                                <button class="btn btn-primary" @click="requestService(prof.id, service.id)">Request Service</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p v-else>No professionals available for this service.</p>
                        </div>
                        <p v-else>Service not found.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service History Section -->
        <div class="accordion-item">
            <h2 class="accordion-header" id="historyHeading">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#historyCollapse">
                    Service History
                </button>
            </h2>
            <div id="historyCollapse" class="accordion-collapse collapse" data-bs-parent="#customerAccordion">
                <div class="accordion-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Service Name</th>
                                <th>Professional Name</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="history in serviceHistory" :key="history.id">
                                <td>{{ history.id }}</td>
                                <td>{{ history.service_name }}</td>
                                <td>{{ history.professional_name }}</td>
                                <td>{{ history.phone }}</td>
                                <td>{{ history.status }}</td>
                                <td>
                                    <button v-if="history.status !== 'closed'" 
                                        class="btn btn-warning" 
                                        @click="openRatingModal(history.id)">
                                        Close It
                                    </button>
                                    <span v-else class="text-success">Closed</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Rating Modal -->
    <div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ratingModalLabel">Rate the Service</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="rating" class="form-label">Rating (1-5)</label>
                        <input type="number" class="form-control" v-model="rating" min="1" max="5" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="submitRating">Submit Rating</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
    `,


    data() {
        return {
            services: [],
            serviceHistory: [],
            token: localStorage.getItem("auth-token"),
            ratingModalVisible: false,
            selectedHistoryId: null,
            rating: null,
        };
    },


    methods: {
        async fetchServices() {
            const response = await fetch('/api/services', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            this.services = await response.json();
        },
        async fetchServiceHistory() {
            const response = await fetch('/api/service-history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            this.serviceHistory = await response.json();
        },
        openRatingModal(historyId) {
            this.selectedHistoryId = historyId;
            this.ratingModalVisible = true;
        },
        closeRatingModal() {
            this.ratingModalVisible = false;
            this.selectedHistoryId = null;
            this.rating = null;
        },
        async submitRating() {
            if (!this.rating || this.rating < 1 || this.rating > 5) {
                alert('Please provide a valid rating between 1 and 5.');
                return;
            }
            try {
                const response = await fetch(`/customer/close_service/${this.selectedHistoryId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    },
                    body: JSON.stringify({ rating: this.rating })
                });
                if (response.ok) {
                    alert('Service closed successfully!');
                    this.fetchServiceHistory(); // Refresh history after closing service
                    this.closeRatingModal();
                } else {
                    alert('Failed to close the service. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    },
    mounted() {
        this.fetchServices();
        this.fetchServiceHistory();
    }
};