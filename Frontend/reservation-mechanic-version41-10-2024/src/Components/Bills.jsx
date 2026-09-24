import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBills } from '../redux/actions/billingActions';
import { Table, Container, Alert, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/actions/authActions';

const Bills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bills = useSelector((state) => state.bills?.bills || []); // Ajout d'une valeur par défaut
  const loading = useSelector((state) => state.bills?.loading);
  const error = useSelector((state) => state.bills?.error);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      dispatch(fetchBills(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('authToken'); // Supprimer le token du stockage local
    localStorage.removeItem('userId'); // Supprimer l'ID utilisateur
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <>
      {/* Barre de navigation */}
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

      {/* Contenu principal */}
      <Container>
        <h2 className="text-center my-4">Mes Factures</h2>

        {loading && <Alert variant="info">Chargement des factures...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Véhicule</th>
            </tr>
          </thead>
          <tbody>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.date}</td>
                  <td>{bill.montant}</td>
                  <td>{bill.vehicule}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Aucune facture disponible
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Bills;