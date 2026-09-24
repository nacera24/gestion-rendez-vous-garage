import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'; 
import { loginUser, registerUser } from '../redux/actions/authActions';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../Images/logo.png';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    userType: 'client',
    specialite: '', // Champ ajouté pour spécialité
    disponibilite: '', // Champ ajouté pour disponibilité
  });

  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth); 

  // Gestion des changements dans les champs de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = storedUsers.find(
        (user) => user.username === formData.username && user.password === formData.password
      );

      if (userExists) {
        localStorage.setItem('loggedInUser', JSON.stringify(userExists));
        localStorage.setItem('userId', userExists.id);
        dispatch(loginUser(userExists.username, userExists.password)); 
        alert('Connexion réussie !');

        // Redirection après la connexion
        if (userExists.userType === 'client') {
          navigate('/client');
        } else {
          navigate('/mecanicien');
        }
      } else {
        alert('Utilisateur non trouvé. Vérifiez vos informations.');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Les mots de passe ne correspondent pas !');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some((user) => user.username === formData.username);

      if (!userExists) {
        // Générer un ID pour le nouvel utilisateur
        formData.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;

        // Ajouter l'utilisateur dans la liste des utilisateurs
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(formData));
        localStorage.setItem('userId', formData.id);

        dispatch(registerUser(formData)); 

        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        setIsLogin(true); 
      } else {
        alert('Cet utilisateur existe déjà.');
      }
    }
  };

  // Redirection après connexion réussie
  if (isAuthenticated) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser?.userType === 'client') {
      navigate('/client');
    } else {
      navigate('/mecanicien');
    }
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo Mécanicien" width="50" height="50" className="d-inline-block align-top" />
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

      <Container className="my-5">
        <Row>
          <Col md={6} className="mx-auto">
            <h2 className="text-center">{isLogin ? 'Connexion' : 'Inscription'}</h2>

            <Form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <Form.Group controlId="firstName">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Entrez votre prénom"
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
                      placeholder="Entrez votre nom"
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
                      placeholder="Entrez votre email"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="birthDate">
                    <Form.Label>Date de naissance</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="userType">
                    <Form.Label>Type d'utilisateur</Form.Label>
                    <Form.Select name="userType" value={formData.userType} onChange={handleInputChange}>
                      <option value="client">Client</option>
                      <option value="mecanicien">Mécanicien</option>
                    </Form.Select>
                  </Form.Group>

                  {formData.userType === 'mecanicien' && (
                    <>
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
                    </>
                  )}
                </>
              )}

              <Form.Group controlId="username">
                <Form.Label>Nom d'utilisateur</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Entrez votre nom d'utilisateur"
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
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </Form.Group>

              {!isLogin && (
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirmez votre mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit">
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              {isLogin ? (
                <p>Pas encore de compte ? <Button variant="link" onClick={() => setIsLogin(false)}>S'inscrire</Button></p>
              ) : (
                <p>Déjà un compte ? <Button variant="link" onClick={() => setIsLogin(true)}>Se connecter</Button></p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;