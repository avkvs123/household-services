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
            <div id="servicesCollapse" class="accordion-collapse collapse" data-bs-parent="#customerAccordion">
                <div class="accordion-body">
                        <table class="table table-bordered table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Service Name</th>
                                <th>Price</th>
                                <th>Time Required (min)</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in services" :key="service.id">
                                <td>{{ service.id }}</td>
                                <td>{{ service.name }}</td>
                                <td>Rs. {{ service.price }}</td>
                                <td>{{ service.time_required }}</td>
                                <td>{{ service.description }}</td>
                                <td>
                                    <button class="btn btn-primary" @click="openModal(service)">View Details</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>



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
                        <div v-if="selectedService">
                            <h3>{{ selectedService.name }}</h3>
                            <p><strong>Description: </strong>{{ selectedService.description }}</p>
                            <p><strong>Time Required: </strong>{{ selectedService.time_required }}</p>
                            <p><strong>Base Price:</strong> {{ selectedService.price }}</p>

                            <h4>Available Professionals</h4>
                            <div v-if="service_professionals.length > 0">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Address</th>
                                            <th>Pincode</th>
                                            <th>Experience</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="prof in service_professionals" :key="prof.id">
                                            <td>{{ prof.name }}</td>
                                            <td>{{ prof.email }}</td>
                                            <td>{{ prof.phone }}</td>
                                            
                                            <td>{{ prof.address }}</td>                                           
                                            <td>{{ prof.pincode }}</td> <!-- Assuming pincode stores contact -->
                                            <td>{{ prof.experience || 'N/A' }}</td>
                                            <td>
                                                <button class="btn btn-primary" @click="requestService(prof.id, selectedService.id)">Request Service</button>
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
                                <th>Date of Request</th>
                                <th>Date of Completion</th>
                                <th>Rating</th>
                                <th>Remarks</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="sr in serviceHistory" :key="sr.id">
                                <td>{{ sr.id }}</td>
                                <td>{{ sr.service_name }}</td>
                                <td>{{ sr.professional_username }}</td>
                                <td>{{ sr.date_of_request }}</td>
                                <td>{{ sr.date_of_completion }}</td>
                                <td>{{ sr.rating }}</td>
                                <td>{{ sr.remarks }}</td>
                                <td>{{ sr.service_status }}</td>

                                
                                <td>
                                    <button 
                                        v-if="sr.service_status !== 'closed' && sr.service_status !== 'rejected'"
                                        class="btn btn-warning" 
                                        @click="openRatingModal(sr)">
                                        Close It
                                    </button>
                                    
                                    <span v-else-if="sr.service_status === 'rejected'" class="text-danger">Rejected</span>
                                    
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
                        <input type="number" class="form-control" v-model="rating_remarks.rating" min="1" max="5" required>
                    </div>
                    <div class="mb-3">
                        <label for="remarks" class="form-label">Remarks</label>
                        <textarea v-model="rating_remarks.remarks" class="form-control" id="remarks" rows="3" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="submitRating()">Submit Rating</button>
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
            service_professionals: [], 
            
            token: localStorage.getItem("auth-token"),
            ratingModalVisible: false,
            selectedHistoryId: null,
            rating: null,

            rating_remarks:{
                request_id:null,
                rating:null,
                remarks:null
            },

            selectedService: {
                id: null,
                name: "",
                description: "",
                time_required: "",
                price: ""
              },
        };
    },


    methods: {
        async openModal(service) {
            // Set selected service details in the modal
            this.selectedService = { ...service };
            const response = await fetch(`/service-professionals/${service.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            this.service_professionals = await response.json();
      
            // Open Bootstrap modal programmatically
            let modal = new bootstrap.Modal(document.getElementById('serviceModal'));
            modal.show();
          },

        async  requestService(prof_id, service_id){
            const response = await fetch(`/create-service-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body:JSON.stringify({
                    "service_id":service_id,
                    "professional_id":prof_id
                  })
            });

            const data = await response.json();
                console.log(data)
                if (response.ok) {
                    alert("Service Request Created Successfully")
                    this.fetchServiceHistory();
                    let modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
                    modal.hide();
                }
                else{
                    alert(`Error: ${data.message}`)
                }
        },


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
            const response = await fetch('/api/service-requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            this.serviceHistory = await response.json();
        },


        openRatingModal(sr) {
            this.rating_remarks.request_id = sr.id
            let modal = new bootstrap.Modal(document.getElementById('ratingModal'));
            modal.show();
            
        },

        async submitRating() {
            if (!this.rating_remarks || this.rating_remarks.rating < 1 || this.rating_remarks.rating > 5) {
                alert('Please provide a valid rating between 1 and 5.');
                return;
            }
            try {
                const response = await fetch(`/customer/close_service`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    },
                    body: JSON.stringify(this.rating_remarks)
                });

                console.log(this.rating_remarks)
                console.log(response.json())
                if (response.ok) {
                    alert('Service closed successfully!');
                    let modal = new bootstrap.Modal(document.getElementById('ratingModal'));
                    modal.hide();
                    this.fetchServiceHistory();
                    
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