/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Button, Container, Row, Col, Card, Table, Modal, Form, Spinner, InputGroup, FormControl } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import api from 'services/axiosInstance';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [priority, setPriority] = useState(0);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Temporary hardcoded token (Replace with a dynamic one from localStorage or context)
  const token = localStorage.getItem('accessToken');

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/category/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.result && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error('Invalid data format', response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(categories); // Initialize filtered categories when categories change
  }, [categories]);

  // Handle file upload validation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      if (file.size > 100 * 1024) {
        setError('Please upload an image smaller than 100KB.');
        return;
      }
      setImage(file);
      setImageURL(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Invalid file type. Only JPG, JPEG, and PNG are allowed.');
    }
  };

  // function for tag
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.target.value.trim();

      if (!value) return; // Prevent empty input

      if (!/^[a-zA-Z\s]+$/.test(value)) {
        setError('Tags can only contain alphabets and spaces! ❌');
        return;
      }

      if (tags.includes(value)) {
        setError('Duplicate tags are not allowed! ❌');
        return;
      }

      setTags([...tags, value]);
      setError(''); // Clear error message
      e.target.value = '';
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Close modal and reset form
  const handleClose = () => {
    setShowModal(false);
    setShowAddModal(false);
    clearForm();
  };

  // Reset form fields
  const clearForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setImageURL('');
    setPriority(0);
    setTags([]);
    setSelectedCategory(null);
  };

  // Handle category deletion with confirmation
  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this category?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/category/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              setCategories(categories.filter((category) => category._id !== id));
              toast.success('Category deleted successfully');
              fetchCategories();
            } catch (error) {
              console.error('Delete error:', error.response?.data || error.message);
              toast.error('Error deleting category');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  // Handle editing a category (populate form with selected category data)
  const handleEdit = useCallback((category) => {
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description);
    setPriority(category.priority || '1');
    setTags(category.tags || []);
    setImageURL(category.image || '');
    setShowModal(true);
  }, []);

  // Open modal to add a new category
  const handleAddCategory = () => {
    clearForm();
    setShowAddModal(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    // Filter the categories based on the search value
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(value) ||
        category.description.toLowerCase().includes(value) ||
        category.tags.some((tag) => tag.toLowerCase().includes(value)) // Added condition for tags array
    );

    setFilteredCategories(filtered);
  };

  // Handle saving a category (Add or Update)
  const handleSaveCategory = async () => {
    if (!name || !description || !priority || tags.length === 0) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    const data = { name, description, priority, tags, image };
    console.log('Sending data:', data);

    try {
      if (selectedCategory) {
        await api.put(`/category/update/${selectedCategory.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        toast.success('Category updated successfully');
      } else {
        await api.post('/category/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        toast.success('Category added successfully');
      }

      // Fetch updated categories list ### again called so commented
      fetchCategories();
    } catch (err) {
      toast.error('Error saving category');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  /** Pagination logic */
  const pageCount = Math.ceil(categories.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentSkills = categories.slice(offset, offset + itemsPerPage);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Category Management</Card.Title>

              <div className="d-flex justify-content-end">
                <Button variant="primary" size="sm" onClick={handleAddCategory}>
                  Add Category
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
                        <th>Name</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Tags</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.length > 0 ? (
                        filteredCategories
                          .filter((cat) => cat.isDeleted === false)
                          .map((category, index) => (
                            <tr key={category.id}>
                              <td>{index + 1}</td>
                              <td>{category.name}</td>
                              <td>{category.description}</td>
                              <td>{category.priority}</td>

                              <td>{Array.isArray(category.tags) ? category.tags.join(', ') : category.tags}</td>
                              <td>
                                {category.image ? (
                                  <img
                                    src={`/${category.image}`}
                                    alt="Category"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                  />
                                ) : (
                                  'No Image'
                                )}
                              </td>
                              <td>
                                <Button variant="success" size="sm" onClick={() => handleEdit(category)}>
                                  Edit
                                </Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">
                            No categories available
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
      <Modal show={showAddModal || showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                maxLength={255}
                required
                placeholder="Enter name"
                onChange={(event) => {
                  if (/^[a-zA-Z\s]*$/.test(event.target.value)) {
                    setName(event.target.value);
                  }
                }}
                onInvalid={(e) => e.target.setCustomValidity('Name is Required')}
                onInput={(e) => e.target.setCustomValidity('')}
              />
            </Form.Group>
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
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept=".jpg,.jpeg,.png" onChange={handleFileUpload} />
              {imageURL && <img src={imageURL} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Control type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} min="0" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (Optional)</Form.Label>
              <Form.Control type="text" placeholder="Enter a tag and press Enter or comma" onKeyDown={handleTagKeyDown} />
              <div className="mt-2">
                {tags.map((tag, index) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <span key={index} className="badge bg-primary me-2" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)}>
                    {tag} &times;
                  </span>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveCategory} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Category'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default CategoryManagement;
