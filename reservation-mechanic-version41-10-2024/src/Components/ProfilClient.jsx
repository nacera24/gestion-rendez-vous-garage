import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../redux/actions/userActions'; 
import { logoutUser } from '../redux/actions/authActions';

const ProfilClient = () => {
  // Définition de l'état initial du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',   
    password: '',
    birthDate: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Accéder aux données de l'utilisateur depuis l'état de Redux
  const { userProfile, loading, error } = useSelector(state => state.user); 
  const clientId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur depuis le localStorage
  console.log('User ID:', clientId);

  // Récupérer le profil de l'utilisateur lors du chargement du composant
  useEffect(() => {
    if (clientId) {
      dispatch(fetchUserProfile(clientId)); // Dispatcher l'action pour récupérer le profil
    }
  }, [clientId, dispatch]);

  // Mettre à jour le formulaire avec les données du profil récupéré
  useEffect(() => {
    if (userProfile) {
      // Vérifiez si birthDate est défini et formatez-le correctement
      const [year, month, day] = userProfile.birthDate.split('-');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Ajouter les zéros initiaux si nécessaire
  
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        username: userProfile.username || '',
        password: '', // Ne pas remplir le mot de passe pour des raisons de sécurité
        birthDate: formattedDate,
      });
    }
  }, [userProfile]);

  // Gérer les changements de saisie dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData)); // Dispatcher l'action pour mettre à jour le profil
    alert('Informations mises à jour avec succès.');
    navigate('/client-profile');
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');  
  };
  // Afficher l'état de chargement ou l'erreur si nécessaire
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

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
              <Nav.Link as={Link} to="/mes-rendezvous">Mes Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/bills">Mes Factures</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button> {/* Bouton de déconnexion */}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Formulaire de profil */}
      <Container className="my-5">
        <h2 className="text-center">Profil</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group controlId="lastName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="username">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="birthDate">
            <Form.Label>Date de Naissance</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Enregistrer les modifications
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default ProfilClient;