import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../redux/actions/userActions';
import { logoutUser } from '../redux/actions/authActions';

const ProfilMecanicien = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',   
    password: '',
    birthDate: '',
    specialite: '', // Champ pour spécialité
    disponibilite: '', // Champ pour disponibilité
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, loading, error } = useSelector(state => state.user); 
  const clientId = localStorage.getItem('userId'); 

  useEffect(() => {
    if (clientId) {
      dispatch(fetchUserProfile(clientId)); 
    }
  }, [clientId, dispatch]);

  // Mettre à jour le formulaire avec les données du profil récupéré
  useEffect(() => {
    if (userProfile) {
      // Vérifiez si birthDate est défini et formatez-le correctement
      console.log('Profil récupéré:', userProfile);
      const [year, month, day] = userProfile.birthDate?.split('-') || ['', '', ''];
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; 

    setFormData({
      firstName: userProfile.firstName || '',
      lastName: userProfile.lastName || '',
      email: userProfile.email || '',
      username: userProfile.username || '',
      password: '', // Ne pas remplir le mot de passe pour des raisons de sécurité
      birthDate: formattedDate,
      specialite: userProfile.specialite || '', 
      disponibilite: userProfile.disponibilite || '', 
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
    // Sauvegarder la spécialité et la disponibilité dans le localStorage
    const updatedProfile = { ...formData };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    dispatch(updateUserProfile(formData, clientId)); 
    alert('Informations mises à jour avec succès.');
    navigate('/mecanicien-profile');
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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/mecanicien-profile">Mon Espace Mécanicien</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/mecanicien">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/manage-appointments">Gérer Mes Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/mecanicien-bills">Mes Facture</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button> {/* Bouton de déconnexion */}
         
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

            <Form.Group controlId="specialite">
            <Form.Label>Spécialité</Form.Label>
            <Form.Control
              type="text"
              name="specialite"
              value={formData.specialite}
              onChange={handleInputChange}
              placeholder="Ex: Freins, Changement d'huile"
            />
          </Form.Group>

          <Form.Group controlId="disponibilite">
            <Form.Label>Disponibilité</Form.Label>
            <Form.Control
              type="text"
              name="disponibilite"
              value={formData.disponibilite}
              onChange={handleInputChange}
              placeholder="Ex: Lundi 09:00-12:00, Mardi 14:00-17:00"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Enregistrer les modifications
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default ProfilMecanicien;