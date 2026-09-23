import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMechanicBills } from '../redux/actions/billingActions';
import { logoutUser } from '../redux/actions/authActions';
import { Table, Container, Alert, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Pour la navigation

const calculateProfitsPerBill = (bills) => {
  if (!Array.isArray(bills)) return []; // Vérifiez que `bills` est bien un tableau
  return bills.map((bill) => {
    const profit = parseFloat(bill.montant) * 0.15;
    return parseFloat(profit.toFixed(2)); // Convertir en nombre avec 2 décimales
  });
};

const MechanicBills = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mechanicId = localStorage.getItem('mechanicId'); // Obtenez l'ID du mécanicien connecté
  const bills = useSelector((state) => state.bills.bills || []); 
  const loading = useSelector((state) => state.bills.loading);
  const error = useSelector((state) => state.bills.error);

  useEffect(() => {
    if (mechanicId) {
      dispatch(fetchMechanicBills(mechanicId));
    }
  }, [dispatch, mechanicId]);

  const profits = calculateProfitsPerBill(bills);

  // Gérer la déconnexion
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); // Rediriger vers la page de connexion après déconnexion
  };

  return (
    <>
      {/* Barre de navigation du mécanicien */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="mechanic-logo-text">Mon Espace Mécanicien</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link as={Link} to="/mecanicien">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/mecanicien-profile">Profil</Nav.Link>
              <Nav.Link as={Link} to="/manage-appointments">Gérer Mes Rendez-vous</Nav.Link>
              
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenu principal */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Tableau de bord du mécanicien</h2>

        {loading && <Alert variant="info">Chargement des factures...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Véhicule</th>
              <th>Bénéfices (15%)</th>
            </tr>
          </thead>
          <tbody>
            {bills.length > 0 ? (
              bills.map((bill, index) => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.date}</td>
                  <td>{bill.montant} $CAD</td>
                  <td>{bill.vehicule}</td>
                  <td>{profits[index]} $CAD</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Aucune facture disponible
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <h4 className="text-center mt-4">
          Total des bénéfices : {profits.reduce((acc, profit) => acc + profit, 0).toFixed(2)} $CAD
        </h4>
      </Container>
    </>
  );
};

export default MechanicBills;