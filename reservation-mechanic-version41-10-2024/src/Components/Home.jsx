import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Home.css'; // Importation du fichier CSS
import logo from '../Images/logo.png'; // Importation du logo

const Home = () => {
  return (
    <>
      {/* Barre de navigation */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              alt="Logo Mécanicien"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
            <span className="logo-text">Votre Véhicule, Notre Priorité</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/services">Services</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link> {/* circuler entre les differents vue */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Section d'introduction */}
      <header className="home-header">
        <Container className="text-center">
          <h1 className="header-title">Bienvenue chez Votre Mécanicien</h1>
          <p className="header-paragraph">
            Nous offrons une gamme complète de services de réparation et d'entretien pour tous les types de véhicules. Prenez rendez-vous en ligne dès aujourd'hui pour profiter de nos services rapides et fiables.
          </p>
          <Button
            variant="primary"
            size="lg"
            as={Link}
            to="/login" 
            className="cta-button"
          >
            Réservez Maintenant
          </Button>
        </Container>
      </header>

      {/* Section Services */}
      <section className="services-section text-center">
        <Container>
          <h2 className="services-heading">Nos Services</h2>
          <p className="services-paragraph">
            Réparations de freins, changements d'huile, diagnostics électroniques et plus encore !
          </p>
          <Button
            variant="secondary"
            as={Link}
            to="/services"
          >
            Voir tous les services
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Home;