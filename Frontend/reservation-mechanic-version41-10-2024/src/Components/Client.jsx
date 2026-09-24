import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ClientProfile.css';

const Client = () => {
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
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button> {/* Bouton de déconnexion */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="client-profile-header">
        <Container className="text-center">
          <h1 className="client-header-title">Bienvenue, {userName} !</h1>
          <p className="client-header-paragraph">Bienvenue dans votre espace client dédié ! Ici, vous pouvez facilement gérer tous les aspects de vos interactions avec notre atelier. 
            Consultez et mettez à jour les informations de votre véhicule, planifiez des rendez-vous à votre convenance, 
            suivez l’avancement des services en cours, et consultez vos factures. Notre objectif est de rendre votre expérience aussi fluide que possible et de vous offrir un service de qualité. 
            Merci de nous faire confiance pour prendre soin de votre véhicule.</p>
        </Container>
      </div>
    </>
  );
};

export default Client;