import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Button, Card, Spinner, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner';
import API_URL from '../_helper';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // Toggle between users and xraydata
  const [users, setUsers] = useState([]);
  const [xrayData, setXrayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Users Data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/view-users`); // API endpoint for users
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  // Fetch Xray Data
  const fetchXrayData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/view-xraydata`); // API endpoint for xray data
      setXrayData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch X-ray data');
    }
    setLoading(false);
  };

  // Handle Tab Change
  const handleTabSelect = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
    if (key === 'users') fetchUsers();
    else fetchXrayData();
  };

  // Handle delete with confirmation
  const handleDelete = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        await axios.delete(`${API_URL}/delete-user/${deleteId}`);
        fetchUsers(); // Refresh data after delete
      } else {
        await axios.delete(`${API_URL}/delete-xraydata/${deleteId}`);
        fetchXrayData(); // Refresh data after delete
      }
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Failed to delete');
    }
    setLoading(false);
    setShowModal(false);
  };

  // Show confirmation modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Pagination logic
  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Render user cards
  const renderUsers = () => {
    return paginateData(users).map((user) => (
      <Card key={user._id} className="mb-3">
        <Card.Body>
          <Card.Title>{user.name_}</Card.Title>
          <Card.Text>Email: {user.email}</Card.Text>
          <Card.Text>Phone: {user.phoneNo}</Card.Text>
          <Button variant="danger" onClick={() => confirmDelete(user._id)}>
            Delete
          </Button>
        </Card.Body>
      </Card>
    ));
  };

  // Render X-ray cards
  const renderXrayData = () => {
    return paginateData(xrayData).map((xray) => (
      <Card key={xray._id} className="mb-3">
        <Card.Body>
          <Card.Title>{xray.email}</Card.Title>
          <img src={`data:image/png;base64,${xray.input_image}`} alt="Input" className="img-thumbnail" width="100" />
          <img src={`data:image/png;base64,${xray.output_image}`} alt="Output" className="img-thumbnail" width="100" />
          <Card.Text>Additional Data: {JSON.stringify(xray.data)}</Card.Text>
          <Button variant="danger" onClick={() => confirmDelete(xray._id)}>
            Delete
          </Button>
        </Card.Body>
      </Card>
    ));
  };

  // Pagination buttons
  const renderPagination = (data) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return (
      <div className="d-flex justify-content-center">
        {[...Array(totalPages).keys()].map((page) => (
          <Button key={page + 1} onClick={() => setCurrentPage(page + 1)} variant="light" className="m-1">
            {page + 1}
          </Button>
        ))}
      </div>
    );
  };

  // Confirmation modal
  const renderConfirmationModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  useEffect(() => {
    fetchUsers(); // Default load users
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h1 className="text-center mb-4">Dashboard</h1>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="users" title="Manage Users">
          {loading ? (
            <div className="d-flex justify-content-center">
              <Oval height={50} width={50} color="#4fa94d" />
            </div>
          ) : (
            <div>
              {renderUsers()}
              {renderPagination(users)}
            </div>
          )}
        </Tab>
        <Tab eventKey="xraydata" title="Manage X-ray Data">
          {loading ? (
            <div className="d-flex justify-content-center">
              <Oval height={50} width={50} color="#4fa94d" />
            </div>
          ) : (
            <div>
              {renderXrayData()}
              {renderPagination(xrayData)}
            </div>
          )}
        </Tab>
      </Tabs>
      {renderConfirmationModal()}
    </div>
  );
};

export default Dashboard;
