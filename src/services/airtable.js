// Using native fetch API for better compatibility

class AirtableService {
  constructor() {
    this.token = process.env.REACT_APP_AIRTABLE_TOKEN;
    this.baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
    this.tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME;
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}/${this.tableName}`;
  }

  // Get headers for API requests
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Test the connection and provide better error messages
  async testConnection() {
    try {
      const response = await fetch(this.baseUrl + '?maxRecords=1', {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Please check your Airtable token and base permissions.');
        } else if (response.status === 404) {
          throw new Error('Airtable base or table not found. Please verify your Base ID and table name.');
        } else if (response.status === 422) {
          throw new Error('Invalid table structure. Please check if the table name and fields exist.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Fetch all records from the CRM table
  async getCustomers() {
    try {
      // Test connection first
      await this.testConnection();
      
      const response = await fetch(this.baseUrl, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Log the actual field names from Airtable for debugging
      if (data.records && data.records.length > 0) {
        console.log('Actual Airtable fields:', Object.keys(data.records[0].fields));
      }

      // Transform Airtable records to our format
      return data.records.map(record => ({
        id: record.id,
        name: record.fields.Name || record.fields.name || '',
        email: record.fields.Email || record.fields.email || '',
        appointmentOn: record.fields['Appointment On'] || '',
        appointmentFor: record.fields['Appointment For'] || '',
        timing: record.fields.Timing || record.fields.timing || record.fields.Time || '',
        // Store the raw record for updates
        _raw: record
      }));
    } catch (error) {
      console.error('Failed to fetch customers from Airtable:', error);
      
      // Provide helpful error messages
      if (error.response?.status === 401) {
        throw new Error('Invalid Airtable token. Please check your credentials.');
      } else if (error.response?.status === 404) {
        throw new Error('Airtable base or table not found. Please check your Base ID and table name.');
      } else if (error.response?.status === 422) {
        throw new Error('Invalid request format. Please check your table structure.');
      }
      
      throw new Error(`Airtable API error: ${error.message}`);
    }
  }

  // Create a new customer record
  async createCustomer(customerData) {
    try {
      console.log('Creating customer with data:', customerData);
      
      // Clean the data like we do for updates
      const cleanFields = {};
      if (customerData.name !== undefined && customerData.name !== null && customerData.name.trim() !== '') {
        cleanFields['Name'] = customerData.name.toString().trim();
      }
      if (customerData.email !== undefined && customerData.email !== null && customerData.email.trim() !== '') {
        cleanFields['Email'] = customerData.email.toString().trim();
      }
      if (customerData.appointmentOn !== undefined && customerData.appointmentOn !== null && customerData.appointmentOn !== '') {
        // Airtable date fields need proper format (YYYY-MM-DD)
        const dateValue = customerData.appointmentOn.toString();
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          cleanFields['Appointment On'] = dateValue;
        } else {
          console.warn('Skipping invalid date format for Appointment On:', dateValue);
        }
      }
      if (customerData.appointmentFor !== undefined && customerData.appointmentFor !== null && customerData.appointmentFor !== '') {
        cleanFields['Appointment For'] = customerData.appointmentFor.toString();
      }
      if (customerData.timing !== undefined && customerData.timing !== null && customerData.timing !== '') {
        cleanFields['Timing'] = customerData.timing.toString();
      }
      
      console.log('Sending create fields to Airtable:', cleanFields);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fields: cleanFields
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Airtable create error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      // Return transformed record
      const record = await response.json();
      return {
        id: record.id,
        name: record.fields.Name || '',
        email: record.fields.Email || '',
        appointmentOn: record.fields['Appointment On'] || '',
        appointmentFor: record.fields['Appointment For'] || '',
        timing: record.fields.Timing || '',
        _raw: record
      };
    } catch (error) {
      console.error('Failed to create customer in Airtable:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  // Update an existing customer record
  async updateCustomer(recordId, customerData) {
    try {
      console.log('Updating customer:', recordId, customerData);
      
      // Clean the data - remove any undefined/null values and only include actual fields
      const cleanFields = {};
      if (customerData.name !== undefined && customerData.name !== null) {
        cleanFields['Name'] = customerData.name.toString();
      }
      if (customerData.email !== undefined && customerData.email !== null) {
        cleanFields['Email'] = customerData.email.toString();
      }
      if (customerData.appointmentOn !== undefined && customerData.appointmentOn !== null && customerData.appointmentOn !== '') {
        // Same date validation for updates
        const dateValue = customerData.appointmentOn.toString();
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          cleanFields['Appointment On'] = dateValue;
        } else {
          console.warn('Skipping invalid date format for Appointment On:', dateValue);
        }
      }
      if (customerData.appointmentFor !== undefined && customerData.appointmentFor !== null) {
        cleanFields['Appointment For'] = customerData.appointmentFor.toString();
      }
      if (customerData.timing !== undefined && customerData.timing !== null) {
        cleanFields['Timing'] = customerData.timing.toString();
      }
      
      console.log('Sending fields to Airtable:', cleanFields);
      
      const response = await fetch(`${this.baseUrl}/${recordId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fields: cleanFields
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Airtable update error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      // Return transformed record
      const record = await response.json();
      return {
        id: record.id,
        name: record.fields.Name || '',
        email: record.fields.Email || '',
        appointmentOn: record.fields['Appointment On'] || '',
        appointmentFor: record.fields['Appointment For'] || '',
        timing: record.fields.Timing || '',
        _raw: record
      };
    } catch (error) {
      console.error('Failed to update customer in Airtable:', error);
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  // Delete a customer record
  async deleteCustomer(recordId) {
    try {
      const response = await fetch(`${this.baseUrl}/${recordId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to delete customer from Airtable:', error);
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }

  // Search customers by name or email
  async searchCustomers(query) {
    try {
      const customers = await this.getCustomers();
      return customers.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to search customers:', error);
      throw error;
    }
  }
}

export default new AirtableService();