export default {
    template: `
    <div class="container mt-4">
        <h2>Welcome Professional</h2>

            <div class="accordion" id="professionalAccordion">

                <!-- Today's Services Section -->
                <div class="accordion-item">
                    <h2 class="accordion-header" id="todayServicesHeading">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#todayServicesCollapse">
                            Today's Services
                        </button>
                    </h2>
                    <div id="todayServicesCollapse" class="accordion-collapse collapse" data-bs-parent="#professionalAccordion">
                        <div class="accordion-body">
                            <table class="table table-bordered table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer Name</th>
                                        <th>Contact</th>
                                        <th>Location</th>
                                        <th>Date of Request</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="service in serviceRequests.filter(s => s.service_status === 'requested' || s.service_status === 'accepted')" :key="service.id">
                                        <td>{{ service.id }}</td>
                                        <td>{{ service.customer_username }}</td>
                                        <td>{{ service.customer_phone }}</td>
                                        <td>{{ service.customer_address }}</td>
                                        <td>{{ service.date_of_request }}</td>
                                        <td>{{ service.service_status }}</td>
                                        
                                        <td>
                                            <div v-if="service.service_status === 'requested'">
                                                <button class="btn btn-primary btn-sm me-2" @click="acceptService(service)">Accept</button>
                                                <button class="btn btn-danger btn-sm" @click="rejectService(service)">Reject</button>
                                            </div>
                                            <div v-else-if="service.service_status === 'accepted'">
                                                <button class="btn btn-success btn-sm" @click="markAsCompleted(service)">Mark as Completed</button>
                                            </div>
                                            <div v-else>
                                                <span class="badge bg-secondary">{{ service.service_status }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Completed Services Section -->
                <div class="accordion-item">
                    <h2 class="accordion-header" id="completedServicesHeading">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#completedServicesCollapse">
                            Completed Services
                        </button>
                    </h2>
                    <div id="completedServicesCollapse" class="accordion-collapse collapse" data-bs-parent="#professionalAccordion">
                        <div class="accordion-body">
                            <table class="table table-bordered table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer Name</th>
                                        <th>Contact</th>
                                        <th>Location</th>
                                        <th>Date of Request</th>
                                        <th>Date of Completion</th>
                                        <th>Rating (Out of 5)</th>
                                        <th>Remarks</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="service in serviceRequests.filter(s => s.service_status === 'completed' || s.service_status === 'closed' || s.service_status === 'rejected')" :key="service.id">
                                        <td>{{ service.id }}</td>
                                        <td>{{ service.customer_username }}</td>
                                        <td>{{ service.customer_phone }}</td>
                                        <td>{{ service.customer_address }}</td>
                                        <td>{{ service.date_of_request }}</td>
                                        <td>{{ service.date_of_completion }}</td>
                                        <td>{{ service.rating || 'N/A' }}</td>
                                        <td>{{ service.remarks || 'N/A' }}</td>
                                        <td>
                                            <span :class="{'text-success': service.service_status === 'closed', 'text-info': service.service_status === 'completed', 'text-danger': service.service_status === 'rejected'}">
                                                {{ service.service_status }}
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
        serviceRequests: [],
        token: localStorage.getItem("auth-token"),

        selectedService: {
            request_id: null,
            action: null
          },
      };
    },
  
    methods: {

        async fetchServiceRequests() {
            const response = await fetch('/api/service-requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                }
            });
            this.serviceRequests = await response.json();
        },

      async markAsCompleted(service) {
        this.selectedService.request_id = service.id;
        this.selectedService.action="completed"
        try {
            const response = await fetch(`/professional/take-action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify(this.selectedService)
            });

            console.log(response.json())
            if (response.ok) {
                alert('Service Action Taken successfully!');
                
                this.fetchServiceRequests();
                
            } else {
                alert('Failed to take action on the service. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
      },


      async acceptService(service) {
        // Logic to accept the service
        this.selectedService.request_id = service.id;
        this.selectedService.action="accepted"
        try {
            const response = await fetch(`/professional/take-action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify(this.selectedService)
            });

            console.log(response.json())
            if (response.ok) {
                alert('Service Action Taken successfully!');
                
                this.fetchServiceRequests();
                
            } else {
                alert('Failed to take action on the service. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
      },
      async rejectService(service) {
        this.selectedService.request_id = service.id;
        this.selectedService.action="rejected"
        try {
            const response = await fetch(`/professional/take-action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token
                },
                body: JSON.stringify(this.selectedService)
            });

            console.log(response.json())
            if (response.ok) {
                alert('Service Action Taken successfully!');
                
                this.fetchServiceRequests();
                
            } else {
                alert('Failed to take action on the service. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
      }
    },

    

    mounted() {
        this.fetchServiceRequests();
    }
    
  };
  