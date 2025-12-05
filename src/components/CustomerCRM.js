import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Calendar,
  Mail,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import airtableService from '../services/airtable';
import './CustomerCRM.css';

const CustomerCRM = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    appointmentOn: '',
    appointmentFor: '',
    timing: ''
  });

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Load customers from Airtable
  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const customersData = await airtableService.getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load customers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.appointmentFor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding new customer
  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
      alert('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const createdCustomer = await airtableService.createCustomer(newCustomer);
      setCustomers([...customers, createdCustomer]);
      setNewCustomer({
        name: '',
        email: '',
        appointmentOn: '',
        appointmentFor: '',
        timing: ''
      });
      setIsAddingCustomer(false);
    } catch (error) {
      console.error('Failed to create customer:', error);
      setError('Failed to create customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing customer
  const handleEditCustomer = async (customer) => {
    setLoading(true);
    try {
      const updatedCustomer = await airtableService.updateCustomer(customer.id, customer);
      setCustomers(customers.map(c => c.id === customer.id ? updatedCustomer : c));
      setEditingCustomer(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
      setError('Failed to update customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting customer
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    setLoading(true);
    try {
      await airtableService.deleteCustomer(customerId);
      setCustomers(customers.filter(c => c.id !== customerId));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      setError('Failed to delete customer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  return (
    <div className="customer-crm">
      <div className="crm-header">
        <div className="header-left">
          <Users size={24} />
          <div>
            <h2>Customer CRM</h2>
            <p>Manage your customer appointments from Airtable</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            onClick={loadCustomers} 
            disabled={loading}
            className="refresh-btn"
            title="Refresh from Airtable"
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
          <button 
            onClick={() => setIsAddingCustomer(true)}
            className="add-customer-btn"
            disabled={loading}
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="dismiss-error">×</button>
        </div>
      )}

      <div className="search-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search customers by name, email, or appointment type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add Customer Form */}
      {isAddingCustomer && (
        <div className="customer-form">
          <h3>Add New Customer</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Customer Name *"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email Address *"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            />
            <input
              type="date"
              placeholder="Appointment Date"
              value={newCustomer.appointmentOn}
              onChange={(e) => setNewCustomer({...newCustomer, appointmentOn: e.target.value})}
            />
            <input
              type="text"
              placeholder="Appointment Purpose"
              value={newCustomer.appointmentFor}
              onChange={(e) => setNewCustomer({...newCustomer, appointmentFor: e.target.value})}
            />
            <input
              type="text"
              placeholder="Timing (e.g., 2:00 PM)"
              value={newCustomer.timing}
              onChange={(e) => setNewCustomer({...newCustomer, timing: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button onClick={() => setIsAddingCustomer(false)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleAddCustomer} disabled={loading} className="save-btn">
              {loading ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </div>
      )}

      <div className="customers-table">
        <div className="table-header">
          <div className="header-cell">Name</div>
          <div className="header-cell">Email</div>
          <div className="header-cell">Appointment Date</div>
          <div className="header-cell">Purpose</div>
          <div className="header-cell">Time</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {loading && customers.length === 0 ? (
            <div className="loading-row">
              <RefreshCw size={18} className="spinning" />
              Loading customers from Airtable...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>No customers found</h3>
              <p>
                {searchTerm 
                  ? 'No customers match your search criteria.' 
                  : 'No customers in your Airtable base yet.'}
              </p>
              {!searchTerm && (
                <button onClick={() => setIsAddingCustomer(true)} className="add-first-btn">
                  Add Your First Customer
                </button>
              )}
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="table-row">
                {editingCustomer?.id === customer.id ? (
                  // Edit mode
                  <>
                    <div className="cell">
                      <input
                        type="text"
                        value={editingCustomer.name}
                        onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                      />
                    </div>
                    <div className="cell">
                      <input
                        type="email"
                        value={editingCustomer.email}
                        onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                      />
                    </div>
                    <div className="cell">
                      <input
                        type="date"
                        value={editingCustomer.appointmentOn}
                        onChange={(e) => setEditingCustomer({...editingCustomer, appointmentOn: e.target.value})}
                      />
                    </div>
                    <div className="cell">
                      <input
                        type="text"
                        value={editingCustomer.appointmentFor}
                        onChange={(e) => setEditingCustomer({...editingCustomer, appointmentFor: e.target.value})}
                      />
                    </div>
                    <div className="cell">
                      <input
                        type="text"
                        value={editingCustomer.timing}
                        onChange={(e) => setEditingCustomer({...editingCustomer, timing: e.target.value})}
                      />
                    </div>
                    <div className="cell actions">
                      <button 
                        onClick={() => handleEditCustomer(editingCustomer)}
                        className="save-btn"
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingCustomer(null)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div className="cell">
                      <div className="customer-name">{customer.name}</div>
                    </div>
                    <div className="cell">
                      <div className="customer-email">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                    </div>
                    <div className="cell">
                      <div className="appointment-date">
                        <Calendar size={14} />
                        {formatDate(customer.appointmentOn)}
                      </div>
                    </div>
                    <div className="cell">
                      <div className="appointment-purpose">{customer.appointmentFor || '-'}</div>
                    </div>
                    <div className="cell">
                      <div className="appointment-time">
                        <Clock size={14} />
                        {customer.timing || '-'}
                      </div>
                    </div>
                    <div className="cell actions">
                      <button 
                        onClick={() => setEditingCustomer({...customer})}
                        className="edit-btn"
                        title="Edit customer"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="delete-btn"
                        title="Delete customer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="table-footer">
        <p>
          Showing {filteredCustomers.length} of {customers.length} customers
          {searchTerm && <span> matching "{searchTerm}"</span>}
        </p>
      </div>
    </div>
  );
};

export default CustomerCRM;