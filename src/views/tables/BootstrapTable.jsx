import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Modal, Button, Form, Container, Row, Col, Card, Table } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

const BootstrapTable = () => {
  const [users, setUsers] = useState([
    { _id: '1', FName: 'Vinay', LName: 'Kumar', email: 'vinayk@gmail.com' },
    { _id: '2', FName: 'Shubh', LName: 'Patil', email: 'shubhz@hotmail.com' },
    { _id: '3', FName: 'Nilima', LName: 'Kale', email: 'nilima@rediffmail.com' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [FName, setFName] = useState('');
  const [LName, setLName] = useState('');
  const [Username, setUsername] = useState('');

  const handleAddUser = () => {
    if (!FName || !LName || !Username) {
      toast.error('Please fill in all fields');
      return;
    }
    const newUser = { _id: Date.now().toString(), FName, LName, email: Username };
    setUsers([...users, newUser]);
    toast.success('User added successfully');
    setShowAddModal(false);
    setFName('');
    setLName('');
    setUsername('');
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setUsers(users.filter((user) => user._id !== id));
            toast.success('User deleted successfully');
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleUpdate = () => {
    if (!FName || !LName || !Username) {
      toast.error('Please fill in all fields');
      return;
    }
    setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, FName, LName, email: Username } : user)));
    toast.success('User updated successfully');
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFName(user.FName);
    setLName(user.LName);
    setUsername(user.email);
    setShowModal(true);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">User Management Table</Card.Title>
              <span className="d-block m-t-5">
                Using Bootstrap <code>Table</code> component
              </span>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.FName}</td>
                        <td>{user.LName}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button variant="success" size="sm" onClick={() => handleEdit(user)}>
                            Update
                          </Button>{' '}
                          <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No users available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                Add User
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={FName} onChange={(e) => setFName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={LName} onChange={(e) => setLName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={Username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={FName} onChange={(e) => setFName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={LName} onChange={(e) => setLName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={Username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default BootstrapTable;
