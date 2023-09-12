import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios
import _ from "lodash";

const AddClientModal = ({ show, onHide, onConfirm, pleaserender, setpleaserender }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessages, setErrorMessages] = useState({});

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    // Perform Axios call to add a client
    const instance = axios.create({
      baseURL: 'http://localhost:8000', // Replace with your API base URL
      withCredentials: true,
    });

    instance
      .post('/api/v2/company/', { company: inputValue })
      .then((response) => {
        console.log(response);
        onConfirm(inputValue);
        setInputValue('');
        onHide(); // Close the modal
        setpleaserender(pleaserender + 1); // Trigger re-render in parent component
      })
      .catch((error) => {
        console.error(error);
        updateErrorMessages(error);
      });
  };

  const updateErrorMessages = (err) => {
    let errorMessagesToUpdate = {};
    let errors = err.response;
    errorMessagesToUpdate = _.mapValues(errors, (error) => error.error);
    setErrorMessages(errorMessagesToUpdate);
    console.log(errorMessagesToUpdate);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          placeholder="Customer name"
          value={inputValue}
          onChange={handleInputChange}
          className="form-control"
        />
        <div className="error">{errorMessages?.data?.company}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddClientModal;
