import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, Navbar, Nav, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png'; 

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
  const navigate = useNavigate(); // Hook pour la navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérification pour que tous les champs sont remplis
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessage("Tous les champs doivent être remplis.");
      setMessageType('error');
      return;
    }

    // Envoyer les données du formulaire à un service d'email (MAIS ICI ON A PAS UN SERVEUR EMAIL)
    setMessage("Votre message a été envoyé avec succès !");
    setMessageType('success');

    // Réinitialiser les champs du formulaire
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    // Rediriger vers la page d'accueil après un petit délai pour afficher le message de succès
    setTimeout(() => {
      navigate('/'); // Navigue vers la page d'accueil
    }, 1000); // Attends 1 seconde avant la redirection
  };

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

      {/* Contact Form section */}
      <Container className="my-5">
        <h1 className="text-center mb-4">Contactez-Nous</h1>
        <p className="text-center mb-4">Si vous avez des questions, n'hésitez pas à nous contacter en remplissant le formulaire ci-dessous.</p>
        
        {/* Message d'erreur ou de succès */}
        {message && (
          <Alert variant={messageType === 'error' ? 'danger' : 'success'}>
            {message}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Entrez votre nom"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Entrez votre email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sujet</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Sujet du message"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Entrez votre message ici"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Envoyer
              </Button>
            </Form>
          </Col>

          {/* Coordonnées de l'entreprise */}
          <Col md={6} className="mt-4 mt-md-0">
            <h4>Nos coordonnées</h4>
            <p><strong>Adresse :</strong> 300, allée des Ursulines, Rimouski, QC G5L 3A1</p>
            <p><strong>Téléphone :</strong> +1 418-723-1986</p>
            <p><strong>Email :</strong> contact@garage.com</p>
            <h4>Heures d'ouverture</h4>
            <p>Lundi - Vendredi : 9h00 - 18h00</p>
            <p>Samedi : 9h00 - 12h00</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Contact;