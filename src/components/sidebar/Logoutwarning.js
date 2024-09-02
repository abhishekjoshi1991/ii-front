import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const Logoutwarning = ({ show, onHide, confirmLogoutAction }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body className="text-center p-3">
                <Modal.Title id="contained-modal-title-vcenter" className="p-2">
                    Are you sure you want to log out?
                </Modal.Title>
                <div className="d-flex justify-content-around mt-2 p-4">
                    <Button variant="secondary" onClick={onHide}>
                        No
                    </Button>
                    <Button variant="danger" onClick={() => {
                        onHide(); 
                        confirmLogoutAction();
                    }}>
                        Yes
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default Logoutwarning;
