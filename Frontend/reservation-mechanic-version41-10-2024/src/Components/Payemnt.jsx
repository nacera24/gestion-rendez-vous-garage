import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPayment, modifyPayment, deletePayment, loadPayments } from '../redux/actions/paymentActions';
import { addPaymentToRdv, updateRdvStatus } from '../redux/actions/appointmentActions';
import { calculateBillAmount, addBill } from '../redux/actions/billingActions';
import { logoutUser } from '../redux/actions/authActions';
import { Table, Button, Modal, Form, Container, Alert, Navbar, Nav } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Payment = () => {
  const { rdvId } = useParams(); // Récupérer l'ID du rendez-vous depuis l'URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection
  const payments = useSelector((state) => state.payments.payments);
  const loading = useSelector((state) => state.payments.loading);
  const error = useSelector((state) => state.payments.error);

  const [showModal, setShowModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    id: null,
    cardType: '',
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    securityCode: '',
    rdvId: rdvId, // Ajouter rdvId à la déclaration de paymentDetails
  });
  const [isEditing, setIsEditing] = useState(false);
  const [rdvDetails, setRdvDetails] = useState(null); // Détails du rendez-vous

  // Charger les paiements et les détails du rendez-vous au chargement initial
  useEffect(() => {
    dispatch(loadPayments());

    // Récupérer les détails du rendez-vous depuis le localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const rdv = appointments.find((appointment) => appointment.id === parseInt(rdvId, 10));
    if (rdv) {
      setRdvDetails(rdv); // Stocker les détails du rendez-vous
    }
  }, [dispatch, rdvId]);

  // Gérer la déconnexion
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); // Rediriger vers la page de connexion
  };

  // Gérer l'ouverture de la modal pour ajouter ou modifier un paiement
  const handleShowModal = (payment = null) => {
    if (payment) {
      setPaymentDetails(payment);
      setIsEditing(true);
    } else {
      setPaymentDetails({
        id: null,
        cardType: '',
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        securityCode: '',
        rdvId: rdvId, // Associer rdvId lors de l'ajout d'un nouveau paiement
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Gérer la soumission du formulaire de paiement
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedPaymentDetails = {
      ...paymentDetails,
      rdvId: rdvId, // Ajouter rdvId
    };
    if (isEditing) {
      dispatch(modifyPayment(updatedPaymentDetails)); // Modifier un paiement existant
    } else {
      dispatch(addPayment(updatedPaymentDetails)); // Ajouter un nouveau paiement
    }
    handleCloseModal();
  };

  // Associer le paiement au rendez-vous et générer une facture
  const handleAttachPaymentToRdv = (paymentId) => {
    console.log(`Association du paiement ID ${paymentId} avec le rendez-vous ID ${rdvId}`);
    if (rdvId && rdvDetails) {
      console.log(`Association du paiement ID ${paymentId} avec le rendez-vous ID ${rdvId}`);

      // Mettre à jour le rendez-vous avec le statut "Payé"
      dispatch(addPaymentToRdv(rdvId, paymentId));
      console.log(`Payement ${paymentId} ajouté au rendez-vous ID ${rdvId}`);
   
      dispatch(updateRdvStatus(rdvId, 'Payé'));

      // Calculer le montant de la facture en utilisant `rdvDetails`
      const montant = calculateBillAmount(rdvDetails);

      // Créer les données de la facture
      const billData = {
        idClient: rdvDetails.idClient,
        montant: montant,
        vehicule: `${rdvDetails.vehicleMake} ${rdvDetails.vehicleModel} - ${rdvDetails.vehicleYear}`,
        date: new Date().toLocaleString(),
      };

      // Ajouter la facture
      dispatch(addBill(billData, rdvId));

      alert('Paiement effectué avec succès ! Une facture a été générée.');
      navigate('/mes-rendezvous'); // Rediriger vers la page des rendez-vous après le paiement
    } else {
      console.error('Erreur : Rendez-vous non trouvé pour générer la facture.');
    }
  };

  // Gérer la suppression d'un paiement
  const handleDeletePayment = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      dispatch(deletePayment(id));
      alert('Paiement supprimé avec succès !');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="client-logo-text">Mon Espace Client</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/client-profile">Mon Profil</Nav.Link>
              <Nav.Link as={Link} to="/gestionVehicules">Mes Véhicules</Nav.Link>
              <Nav.Link as={Link} to="/appointments">Planifier Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/mes-rendezvous">Mes Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/bills">Mes Factures</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenu du composant Payment */}
      <Container>
        <h2 className="text-center my-4">Gérer les Paiements pour le Rendez-vous {rdvId}</h2>

        {loading && <Alert variant="info">Chargement des paiements...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
          Ajouter un Nouveau Paiement
        </Button>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Type de Carte</th>
              <th>Numéro de Carte</th>
              <th>Nom du Titulaire</th>
              <th>Date d'Expiration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.cardType}</td>
                  <td>{payment.cardNumber.replace(/\d{12}(\d{4})/, '**** **** **** $1')}</td>
                  <td>{payment.cardHolderName}</td>
                  <td>{payment.expirationDate}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleShowModal(payment)}
                      className="me-2"
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePayment(payment.id)}
                      className="me-2"
                    >
                      Supprimer
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAttachPaymentToRdv(payment.id)}
                    >
                      Utiliser ce Paiement
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Aucun moyen de paiement disponible
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal pour ajouter ou modifier un paiement */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Modifier le Paiement' : 'Ajouter un Nouveau Paiement'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="cardType">
                <Form.Label>Type de Carte</Form.Label>
                <Form.Select
                  value={paymentDetails.cardType}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardType: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un type de carte</option>
                  {['Débit', 'Crédit', 'Visa', 'MasterCard', 'American Express'].map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="cardNumber" className="mt-3">
                <Form.Label>Numéro de Carte</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Numéro de Carte"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="cardHolderName" className="mt-3">
                <Form.Label>Nom du Titulaire</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nom du Titulaire"
                  value={paymentDetails.cardHolderName}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardHolderName: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="expirationDate" className="mt-3">
                <Form.Label>Date d'Expiration</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM/AA"
                  value={paymentDetails.expirationDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, expirationDate: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group controlId="securityCode" className="mt-3">
                <Form.Label>Code de Sécurité</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Code de Sécurité"
                  value={paymentDetails.securityCode}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, securityCode: e.target.value })}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                {isEditing ? 'Modifier' : 'Ajouter'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Payment;