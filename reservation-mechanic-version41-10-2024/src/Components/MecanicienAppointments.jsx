import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  loadAppointments,
  updateRdvStatus,
  approveModification,
  rejectModification,
} from '../redux/actions/appointmentActions'; 
import { logoutUser } from '../redux/actions/authActions';
import { Table, Container, Navbar, Nav, Button, Modal, Form, Alert } from 'react-bootstrap';


const MechanicAppointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.appointments);
  const mechanicId = parseInt(localStorage.getItem('userId'), 10);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [duration, setDuration] = useState('');
  const [costEstimate, setCostEstimate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(loadAppointments());
  }, [dispatch]);

  const mechanicAppointments = appointments.filter(
    (appointment) => appointment.mechanicId === mechanicId
  );

  const handleConfirm = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleRefuse = (appointment) => {
    const reasonPrompt = prompt('Veuillez indiquer la raison du refus :');
    if (reasonPrompt) {
      dispatch(updateRdvStatus(appointment.id, 'Refusé', reasonPrompt));
      setSuccessMessage('Le rendez-vous a été refusé avec succès.');
    }
  };

  const handleSave = () => {
    if (selectedAppointment) {
      const updatedDetails = {
        duration,
        costEstimate,
        status: 'Confirmé',
      };
      dispatch(updateRdvStatus(selectedAppointment.id, 'Confirmé', null, updatedDetails));
      setShowModal(false);
      setSuccessMessage('Le rendez-vous a été confirmé avec succès.');
      setSelectedAppointment(null);
      setDuration('');
      setCostEstimate('');
    }
  };

  const handleApprove = (appointment) => {
    if (appointment.modified) {
      dispatch(approveModification(appointment.id));
      setSuccessMessage('Modification approuvée avec succès.');
    }
  };

  const handleRejectModification = (appointment) => {
    const reason = prompt('Veuillez indiquer la raison du refus :');
    if (reason && appointment.modified) {
      dispatch(rejectModification(appointment.id, reason));
      setSuccessMessage('Modification refusée avec succès.');
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');  
  };

  return (
    <>
      {/* Barre de navigation */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/mecanicien-profile">Mon Espace Mécanicien</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/mecanicien">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/mecanicien-profile">Profil</Nav.Link>
              <Nav.Link as={Link} to="/mecanicien-bills">Mes Facture</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button> {/* Bouton de déconnexion */}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Message de succès */}
      <Container className="my-3">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
      </Container>

      {/* Contenu principal */}
      <Container className="my-5">
        <h2 className="text-center">Mes Rendez-vous à venir</h2>
        {mechanicAppointments.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Véhicule</th>
                <th>Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mechanicAppointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td>{appointment.clientName}</td>
                  <td>{`${appointment.vehicleMake} ${appointment.vehicleModel} - ${appointment.vehicleYear}`}</td>
                  <td>{appointment.service}</td>
                  <td>
                    {appointment.status === 'Confirmé' ? (
                      <span className="text-success">Confirmé</span>
                    ) : appointment.status === 'Payé' ? (
                      <span className="text-success">Payé</span>
                    ) :appointment.status === 'Refusé' ? (
                      <span className="text-danger">Refusé</span>
                    ) : (
                      <>
                        <Button variant="success" onClick={() => handleConfirm(appointment)}>Confirmer</Button>{' '}
                        <Button variant="danger" onClick={() => handleRefuse(appointment)}>Refuser</Button>
                      </>
                    )}
                    {appointment.modified && appointment.status !== 'Confirmé' && appointment.status !== 'Refusé' && (
                      <>
                        <Button variant="success" onClick={() => handleApprove(appointment)}>
                          Approuver la modification
                        </Button>
                        <Button variant="danger" onClick={() => handleRejectModification(appointment)}>
                          Refuser la modification
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">Aucun rendez-vous à venir.</p>
        )}

        {/* Modal pour ajouter des détails de confirmation */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmer le Rendez-vous</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="duration">
                <Form.Label>Durée estimée (en heures)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez la durée estimée"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="costEstimate" className="mt-3">
                <Form.Label>Devis pour le coût (en $CAD)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Entrez le devis pour le coût"
                  value={costEstimate}
                  onChange={(e) => setCostEstimate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button variant="primary" onClick={handleSave}>Sauvegarder</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default MechanicAppointments;