import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import logo from '../Images/logo.png'; 

const Services = () => {
  const servicesList = [
    { title: 'Réparation de freins', description: 'Remplacement et entretien des freins pour une conduite sécurisée.', prix: '150$' },
    { title: 'Changement d\'huile', description: 'Changement d\'huile rapide et efficace pour tous les véhicules.', prix: '100$' },
    { title: 'Diagnostic électronique', description: 'Diagnostic complet pour repérer les pannes électroniques.', prix: '120$' },
    { title: 'Remplacement de pneus', description: 'Remplacement et équilibrage des pneus pour une meilleure tenue de route.', prix: '90$' },
  ];

  return (
    <>
      {/* Navbar section */}
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
              <Nav.Link as={Link} to="/login">Login</Nav.Link> 
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Services section */}
      <Container className="my-5">
        <h1 className="text-center">Nos Services</h1>
        <p className="text-center">Découvrez nos services de réparation et d'entretien automobile.</p>
        <Row>
          {servicesList.map((service, index) => (
            <Col md={4} key={index}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{service.description}</Card.Text>
                  <p><strong>Prix: {service.prix}</strong></p>
                  <Button variant="primary" as={Link} to="/Login">Réservez Maintenant</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Services;