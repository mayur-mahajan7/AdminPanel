/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Button, Container, Row, Col, Card, Table, Modal, Form, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import api from 'services/axiosInstance';

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [filteredskills, setfilteredSkills] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainCategoryId, setMainCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  /** Fetch all skills */
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/skill/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.data && Array.isArray(response.data.data)) {
        setSkills(response.data.data);
      } else {
        toast.error(response.data.message || 'Invalid response from server');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching skills');
    } finally {
      setLoading(false);
    }
  }, [token]);

  /** Fetch main categories */
  const fetchMainCategories = async () => {
    try {
      const response = await api.get('/category/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data.data)) {
        setMainCategories(response.data.data);
      } else if (response.data.categories && Array.isArray(response.data.categories)) {
        setMainCategories(response.data.categories);
      } else {
        toast.error('Invalid category data received.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch categories.');
    }
  };

  /** Fetch data on component mount */
  useEffect(() => {
    fetchSkills();
    fetchMainCategories();
  }, []);

  useEffect(() => {
    setfilteredSkills(skills);
  }, [skills]);

  /** Close modal and reset form */
  const handleClose = () => {
    setShowModal(false);
    clearForm();
  };

  /** Clear form fields */
  const clearForm = () => {
    setName('');
    setDescription('');
    setMainCategoryId('');
    setSelectedSkill(null);
  };

  /** Handle delete confirmation */
  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this skill?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/skill/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              await fetchSkills();
              toast.success('Skill deleted successfully');
            } catch (error) {
              toast.error('Error deleting skill');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  /** Handle edit skill */
  const handleEdit = (skill) => {
    setSelectedSkill(skill);
    setName(skill.name);
    setDescription(skill.description);
    setMainCategoryId(skill.main_category_id.id.toString());
    setSelectedCategoryName(skill.main_category_id.name);
    setShowModal(true);
  };
  // const handleEdit = (skill) => {
  //   setSelectedSkill(skill);
  //   setName(skill.name);
  //   setDescription(skill.description);
  //   setMainCategoryId(skill.main_category_id?.id?.toString() || skill.main_category_id?.toString() || "");
  //   setShowModal(true);
  // };

  /** Handle add new skill */
  const handleAddSkill = () => {
    clearForm();
    setShowModal(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = skills.filter((skill) => skill.name.toLowerCase().includes(value) || skill.description.toLowerCase().includes(value));
    setfilteredSkills(filtered);
  };

  /** Handle save skill (both add and edit) */
  const handleSaveSkill = async () => {
    if (!name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }
    if (!mainCategoryId) {
      toast.error('Please select a main category');
      return;
    }

    setLoading(true);
    const skillData = {
      name: name.trim(),
      description: description.trim(),
      main_category_id: mainCategoryId
    };
    const data = {
      name,
      description,
      main_category_id: mainCategoryId
    };
    console.log(data);

    try {
      if (selectedSkill) {
        await api.put(`/skill/update/${selectedSkill.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Skill updated successfully');
      } else {
        await api.post('/skill/create', skillData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Skill added successfully');
      }

      await fetchSkills();
    } catch (err) {
      toast.error('Error saving skill');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  /** Pagination logic */
  const pageCount = Math.ceil(skills.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  // eslint-disable-next-line no-unused-vars
  const currentSkills = skills.slice(offset, offset + itemsPerPage);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Skills Management</Card.Title>
              <div className="d-flex justify-content-end">
                <Button variant="primary" size="sm" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </div>
              <Form>
                <InputGroup>
                  <FormControl value={search} onChange={handleSearch} placeholder="Search" />
                </InputGroup>
              </Form>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Skill Name</th>
                        <th>Description</th>
                        <th>Main Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredskills.length > 0 ? (
                        filteredskills.map((skill, index) => (
                          <tr key={skill.id}>
                            <td>{offset + index + 1}</td>
                            <td>{skill.name}</td>
                            <td>{skill.description}</td>

                            <td>{skill.main_category_id?.name || 'Unknown'}</td>
                            <td>
                              <Button variant="success" size="sm" onClick={() => handleEdit(skill)}>
                                Edit
                              </Button>{' '}
                              <Button variant="danger" size="sm" onClick={() => handleDelete(skill.id)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No Skills available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <ReactPaginate
                    previousLabel={<span aria-hidden="true">←</span>}
                    nextLabel={<span aria-hidden="true">→</span>}
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={window.innerWidth < 768 ? 2 : 3} // Responsive page range
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName="pagination justify-content-center mt-3" // Centered pagination
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item disabled"
                    breakLinkClassName="page-link"
                    activeClassName="active"
                    disabledClassName="disabled"
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL FOR ADD/EDIT SKILL */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedSkill ? 'Edit Skill' : 'Add Skill'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Skill Name Field */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                maxLength={255}
                required
                placeholder="Enter Skill name"
                onChange={(event) => {
                  if (/^[a-zA-Z\s]*$/.test(event.target.value)) {
                    setName(event.target.value);
                  }
                }}
                onInvalid={(e) => e.target.setCustomValidity('Name is Required')}
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </Form.Group>

            {/* Skill Description Field */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                maxLength={400}
                placeholder="Enter Description"
                onChange={(event) => {
                  if (/^[a-zA-Z\s]*$/.test(event.target.value)) {
                    setDescription(event.target.value);
                  }
                }}
                onInvalid={(e) => e.target.setCustomValidity('Description is Required')}
                onInput={(e) => e.target.setCustomValidity('')}
                required
              />
            </Form.Group>

            {/* Main Category Dropdown */}

            <Form.Group className="mb-3">
              <Form.Label>Main Category</Form.Label>
              <Form.Select value={mainCategoryId} onChange={(e) => setMainCategoryId(e.target.value)}>
                {!mainCategoryId && <option value={mainCategoryId}>Select Category</option>}
                {mainCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveSkill} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Skill'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default SkillManagement;
