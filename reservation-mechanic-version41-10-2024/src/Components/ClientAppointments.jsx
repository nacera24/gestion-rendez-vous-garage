import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadRdvs, deleteRdv, modifyRdv } from '../redux/actions/appointmentActions'; 
import { logoutUser } from '../redux/actions/authActions';
import { Table, Container, Alert, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const ClientAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rdvs = useSelector((state) => state.appointments.userRdvs);

  // Charger les rendez-vous lors du montage du composant
  useEffect(() => {
    dispatch(loadRdvs());
  }, [dispatch]);

  // Gérer la déconnexion
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

// Gérer la modification d'un rendez-vous avec validation de la date
const handleModify = (rdv) => {
  const newDate = prompt('Entrez la nouvelle date (yyyy-mm-dd hh:mm):', rdv.date);
  
  // Vérifier si la nouvelle date est valide
  if (newDate && !isNaN(Date.parse(newDate))) {
    const modifiedRdv = { ...rdv, date: newDate, modified: true };
    dispatch(modifyRdv(modifiedRdv));
  } else {
    alert('Veuillez entrer une date valide.');
  }
};

  // Gérer la suppression d'un rendez-vous
  const handleDelete = (appointmentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      dispatch(deleteRdv(appointmentId));
    }
  };
// Gérer le paiement d'un rendez-vous
   const handlePayment = (rdvId) => {
    console.log("ID du rendez-vous:", rdvId); 
    navigate(`/payments/${rdvId}`); // Rediriger vers la page de paiement avec l'ID du rendez-vous
   };
  if (!rdvs) {
    return (
      <Alert variant="info" className="text-center my-5">
        Chargement des rendez-vous...
      </Alert>
    );
  }

  return (
    <>
      {/* Barre de navigation */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/client-profile">Mon Espace Client</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/client">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/gestionVehicules">Mes Véhicules</Nav.Link>
              <Nav.Link as={Link} to="/appointments">Planifier Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/bills">Mes Factures</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenu principal */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Mes Rendez-vous</h2>

        {rdvs.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Véhicule</th>
                <th>Mécanicien</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rdvs.map((rdv, index) => (
                <tr key={index}>
                  <td>{new Date(rdv.date).toLocaleString()}</td>
                  <td>{rdv.service}</td>
                  <td>{`${rdv.vehicleMake} ${rdv.vehicleModel} - ${rdv.vehicleYear}`}</td>
                  <td>{rdv.mechanicName}</td>
                  <td>{rdv.status || 'En attente'}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(rdv.id)}
                    >
                      Annuler
                    </Button>{' '}
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleModify(rdv)} 
                    >
                      Modifier
                    </Button>
                    {' '}
                    {rdv.status === 'Confirmé' && !rdv.idPayment && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handlePayment(rdv.id)}
                      >
                        Payer
                      </Button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info" className="text-center">
            Vous n'avez aucun rendez-vous pour le moment.
          </Alert>
        )}
      </Container>
    </>
  );
};

export default ClientAppointments;