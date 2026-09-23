import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav , Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions.jsx';
import { Link, useNavigate } from 'react-router-dom';
import '../css/MechanicProfile.css';

const Mechanicien = () => {
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le nom de l'utilisateur depuis le localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');  
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="mechanic-logo-text">Mon Espace Mécanicien</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/mecanicien-profile">Profil</Nav.Link>
              <Nav.Link as={Link} to="/manage-appointments">Gérer Mes Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/mecanicien-bills">Mes Facture</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button> {/* Bouton de déconnexion */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="mechanic-profile-header">
        <Container className="text-center">
          <h1 className="mechanic-header-title">Bienvenue, {userName} !</h1>
          <p className="mechanic-header-paragraph">Cet espace vous permet de gérer vos rendez-vous de manière efficace. 
            Consultez les détails des véhicules, planifiez les interventions et suivez les progrès des réparations en cours. 
            Accédez facilement aux factures et aux dossiers clients pour offrir un service personnalisé.</p>
        </Container>
      </div>
    </>
  );
};

export default Mechanicien