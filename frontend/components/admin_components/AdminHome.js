export default {
    template: `
    <div class="container mt-4">
        <h2>Welcome Admin</h2>

        <div class="accordion" id="adminAccordion">
            <!-- Services Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="servicesHeading">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#servicesCollapse">
                        Services
                    </button>
                </h2>
                <div id="servicesCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
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
                                        <button class="btn btn-sm btn-primary" @click="openEditModal(service)">Edit</button>
                                        <button class="btn btn-sm btn-danger" @click="deleteService(service.id)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- Modal for Editing Service -->
                        <div class="modal fade" id="editServiceModal" tabindex="-1" aria-labelledby="editServiceModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editServiceModalLabel">Edit Service</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="updateService">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Service Name</label>
                                    <input v-model="selectedService.name" type="text" class="form-control" id="name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <textarea v-model="selectedService.description" class="form-control" id="description" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="time_required" class="form-label">Time Required</label>
                                    <input v-model.number="selectedService.time_required" type="number" class="form-control" id="time_required" required>
                                </div>
                                <div class="mb-3">
                                    <label for="base_price" class="form-label">Base Price</label>
                                    <input v-model.number="selectedService.price" type="number" class="form-control" id="base_price" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Update</button>
                                </form>
                            </div>
                            </div>
                        </div>
                        </div>



                        <div>
                        <!-- Create New Service Button -->
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addServiceModal" >
                            Create New Service
                            </button>

                            <!-- Modal for Adding New Service -->
                            <div class="modal fade" id="addServiceModal" tabindex="-1" aria-labelledby="addServiceModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="addServiceModalLabel">Add New Service</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="addService">
                                    <div class="mb-3">
                                        <label for="name" class="form-label">Service Name</label>
                                        <input v-model="newService.name" type="text" class="form-control" id="name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="description" class="form-label">Description</label>
                                        <textarea v-model="newService.description" class="form-control" id="description" rows="3"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="time_required" class="form-label">Time Required</label>
                                        <input v-model.number="newService.time_required" type="number" class="form-control" id="time_required" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="base_price" class="form-label">Base Price</label>
                                        <input v-model.number="newService.price" type="number" class="form-control" id="base_price" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Professionals Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="professionalsHeading">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#professionalsCollapse">
                        Professionals
                    </button>
                </h2>
                <div id="professionalsCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
                    <div class="accordion-body">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Experience</th>
                                    <th>Service Name</th>
                                    <th>Address</th>
                                    <th>Pincode</th>
                                    <th>Approved</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="professional in professionals" :key="professional.id">
                                    <td>{{ professional.id }}</td>
                                    <td>{{ professional.name }}</td>
                                    <td>{{ professional.experience }} years</td>
                                    <td>{{ professional.service }}</td>
                                    <td>{{ professional.address }}</td>
                                    <td>{{ professional.pincode }}</td>
                                    <td>
                                        <span v-if="professional.is_active">Yes</span>
                                        <span v-else>No</span>
                                    </td>
                                    <td>
                                        <button 
                                            v-if="!professional.is_active" 
                                            class="btn btn-sm btn-success" 
                                            @click="toggleProfessionalStatus(professional)">
                                            Approve
                                        </button>
                                        
                                        <button 
                                            v-else 
                                            class="btn btn-sm btn-danger" 
                                            @click="toggleProfessionalStatus(professional)">
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Customers Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="customersHeading">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#customersCollapse">
                        Customers
                    </button>
                </h2>
                <div id="customersCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
                    <div class="accordion-body">
                        <table class="table table-bordered table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="customer in customers" :key="customer.id">
                                    <td>{{ customer.id }}</td>
                                    <td>{{ customer.name }}</td>
                                    <td>{{ customer.email }}</td>
                                    <td>{{ customer.address }}</td>
                                    <td>{{ customer.phone }}</td>
                                    <td>
                                        <span v-if="customer.is_active">Yes</span>
                                        <span v-else>No</span>
                                    </td>
                                    <td>
                                        <button 
                                            v-if="!customer.is_active" 
                                            class="btn btn-sm btn-success" 
                                            @click="toggleCustomerStatus(customer)">
                                            Activate
                                        </button>
                                        
                                        <button 
                                            v-else 
                                            class="btn btn-sm btn-danger" 
                                            @click="toggleCustomerStatus(customer)">
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <!-- Service Requests Section -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="requestsHeading">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#requestsCollapse">
                        Service Requests
                    </button>
                </h2>
                <div id="requestsCollapse" class="accordion-collapse collapse" data-bs-parent="#adminAccordion">
                    <div class="accordion-body">
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
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="request in serviceRequests" :key="request.id">
                                    <td>{{ request.id }}</td>
                                    <td>{{ request.professional_username || '' }}</td>
                                    <td>{{ request.customer_username || '' }}</td>
                                    <td>{{ request.service_name || '' }}</td>
                                    <td>{{ request.date_of_request || '' }}</td>
                                    <td>{{ request.date_of_completion || '' }}</td>
                                    <td>
                                    <span :class="{'text-success': request.service_status === 'closed', 'text-info': request.service_status === 'completed', 
                                    'text-danger': request.service_status === 'rejected', 
                                     'text-warning': request.service_status === 'accepted' }">
                                    {{ request.service_status || '' }}
                                            </span>
                                    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            services: [],
            professionals: [],
            serviceRequests: [],
            customers: [],
            token: localStorage.getItem("auth-token"),
            newService: {
                name: "",
                price: "",
                time_required: "",
                description: "",
            },
            selectedService: {
                id: null,
                name: "",
                time_required: "",
                description: "",
                price: "",
              },
        };
    },
    mounted() {
        this.fetchServices();
        this.fetchProfessionals();
        this.fetchCustomers();
        this.fetchServiceRequests();
    },
    methods: {
        async fetchServices() {
            const response = await fetch('/api/services');
            this.services = await response.json();
        },
        async fetchProfessionals() {
            const response = await fetch('/api/professionals', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            
            this.professionals = await response.json();
            console.log(this.professionals)
        },
        async fetchServiceRequests() {
            const response = await fetch('/api/service-requests',{
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            
            this.serviceRequests = await response.json();
            console.log(this.serviceRequests)
        },
        async showAddServiceModal(){
            console.log("Create_new_service")
        },
        

        async toggleProfessionalStatus(professional) {
            try {
                const activate = !professional.is_active;
                const url = activate 
                    ? `/activate_professional/${professional.id}` 
                    : `/deactivate_professional/${professional.id}`;
                
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.token,  // Ensure you're passing the auth token
                    }
                });

                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    professional.is_active = activate; // Update status dynamically
                    alert(`Success: ${data.message}`); // Show backend message in a popup
                    this.fetchProfessionals();
                } else {
                    console.error("Error:", data.message);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Network error:", error);
                alert("Network error. Please try again.");
            }
        },
        async deleteService(id){
            console.log(id)
            const response = await fetch('/api/services',{
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.token,  // Ensure you're passing the auth token
                },
                body: JSON.stringify({"id":id}),
            });
            const data = await response.json();
                console.log(data)
                if (response.ok) {
                    alert("Service Deleted Successfully")
                    this.fetchServices();
                }
                else{
                    alert(`Error: ${data.message}`)
                }
        },

        async addService() {
            try {
              const response = await fetch("/api/services", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": this.token,  // Ensure you pass the auth token correctly
                },
                body: JSON.stringify(this.newService),
              });
      
              const data = await response.json();
              if (response.ok) {
                alert("Service Added Successfully!");
                this.showAddServiceModal = false;  // Close modal on success
                let modal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
                modal.hide();

                this.fetchServices();
              } else {
                alert(`Error: ${data.message}`);
              }
            } catch (error) {
              console.error("Error:", error);
              alert("Failed to add service.");
            }
          },
          openEditModal(service) {
            // Set selected service details in the modal
            this.selectedService = { ...service };
      
            // Open Bootstrap modal programmatically
            let modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
            modal.show();
          },
          async updateService() {
            try {
              console.log("Updating service:", this.selectedService);
      
              const response = await fetch(`/api/services`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token":this.token, // Ensure correct token is sent
                },
                body: JSON.stringify(this.selectedService),
              });
      
              const data = await response.json();
              if (response.ok) {
                alert("Service Updated Successfully!");
      
                // Close the modal using Bootstrap's JS API
                let modal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
                modal.hide();
                this.fetchServices();
              } else {
                alert(`Error: ${data.message}`);
              }
            } catch (error) {
              console.error("Error:", error);
              alert("Failed to update service.");
            }
          },

          async fetchCustomers() {
            try {
                const response = await fetch('/api/customers', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    }
                });
                this.customers = await response.json();
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },
        async toggleCustomerStatus(customer) {
            try {
                const activate = !customer.is_active;
                const url = activate 
                    ? `/activate_customer/${customer.id}` 
                    : `/deactivate_customer/${customer.id}`;
                
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.token,
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    customer.is_active = activate; // Update status dynamically
                    alert(`Success: ${data.message}`);
                    this.fetchCustomers();
                } else {
                    console.error("Error:", data.message);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Network error:", error);
                alert("Network error. Please try again.");
            }
        }
    
        
    }
};
