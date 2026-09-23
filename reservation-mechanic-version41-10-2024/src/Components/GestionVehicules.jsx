import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Table, Modal, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  addVehicle,
  editVehicle,
  deleteVehicle,
  searchVehicleByVin,
  searchVehicleByDetails,
  loadVehicles,
} from '../redux/actions/vehicleActions';

const GestionVehicules = () => {
  const [showModal, setShowModal] = useState(false);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    manualEntry: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vehicles, vehicleDetails, loading, error } = useSelector((state) => state.vehicles);

  useEffect(() => {
    dispatch(loadVehicles());
  }, [dispatch]);

  useEffect(() => {
    console.log("Véhicules chargés dans le composant GestionVehicules:", vehicles);
  }, [vehicles]);

  useEffect(() => {
    if (vehicleDetails) {
      setVehicleData((prevData) => ({
        ...prevData,
        ...vehicleDetails,
      }));
    }
  }, [vehicleDetails]);

  const resetVehicleData = () => {
    setVehicleData({
      vin: '',
      make: '',
      model: '',
      year: '',
      manualEntry: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleAddVehicleModal = () => {
    resetVehicleData();
    setShowModal(true);
  };

  const handleEditVehicle = (id) => {
    const updatedVehicle = vehicles.find((vehicle) => vehicle.id === id);
    if (updatedVehicle) {
      setVehicleData(updatedVehicle);
      setShowModal(true);
    }
  };

  const handleDeleteVehicle = (id) => {
    dispatch(deleteVehicle(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const newVehicleData = { ...vehicleData, userId, repairs: vehicleData.repairs || [] };

    if (vehicleData.id) {
      dispatch(editVehicle(vehicleData));
    } else {
      if (vehicleData.manualEntry || (vehicleData.make && vehicleData.model && vehicleData.year && vehicleData.vin)) {
        dispatch(addVehicle(newVehicleData));
        dispatch(loadVehicles());
      } else if (vehicleData.vin) {
        dispatch(searchVehicleByVin(vehicleData.vin));
      } else if (vehicleData.make && vehicleData.model && vehicleData.year) {
        dispatch(searchVehicleByDetails(vehicleData.make, vehicleData.model, vehicleData.year));
      }
    }

    resetVehicleData();
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleRepairs = (vehicleId) => {
    setExpandedVehicleId(expandedVehicleId === vehicleId ? null : vehicleId);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Mon Espace Client</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/client">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/client-profile">Mon Profil</Nav.Link>
              <Nav.Link as={Link} to="/appointments">Planifier Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/mes-rendezvous">Mes Rendez-vous</Nav.Link>
              <Nav.Link as={Link} to="/bills">Mes Factures</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5">
        <h2 className="text-center">Gestion des Véhicules</h2>
        {loading && <div>Chargement...</div>}
        {error && <div>Erreur: {error}</div>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Année</th>
              <th>VIN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <React.Fragment key={vehicle.id}>
                <tr>
                  <td>{vehicle.id}</td>
                  <td>{vehicle.make}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.vin}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditVehicle(vehicle.id)}>Modifier</Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteVehicle(vehicle.id)}>Supprimer</Button>{' '}
                    <Button variant="info" onClick={() => toggleRepairs(vehicle.id)}>
                      {expandedVehicleId === vehicle.id ? 'Masquer Réparations' : 'Afficher Réparations'}
                    </Button>
                  </td>
                </tr>
                {expandedVehicleId === vehicle.id && (
                  <tr>
                    <td colSpan="6">
                      <h5>Historique des Réparations</h5>
                      {vehicle.repairs && vehicle.repairs.length > 0 ? (
                        <Table bordered>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Coût</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicle.repairs.map((repair, index) => (
                              <tr key={index}>
                                <td>{repair.date}</td>
                                <td>{repair.description}</td>
                                <td>{repair.cost} $</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>Aucune réparation enregistrée pour ce véhicule.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>

        <Button variant="primary" onClick={handleAddVehicleModal}>Ajouter un véhicule</Button>

        <Modal show={showModal} onHide={() => { resetVehicleData(); setShowModal(false); }}>
          <Modal.Header closeButton>
            <Modal.Title>{vehicleData.id ? 'Modifier' : 'Ajouter'} un véhicule</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="manualEntry">
                <Form.Check
                  type="checkbox"
                  label="Entrée manuelle"
                  name="manualEntry"
                  checked={vehicleData.manualEntry}
                  onChange={() => setVehicleData({ ...vehicleData, manualEntry: !vehicleData.manualEntry })}
                />
              </Form.Group>

              <Form.Group controlId="vin">
                <Form.Label>VIN</Form.Label>
                <Form.Control
                  type="text"
                  name="vin"
                  value={vehicleData.vin}
                  onChange={handleInputChange}
                  placeholder="Entrer le VIN"
                />
              </Form.Group>

              <Form.Group controlId="make">
                <Form.Label>Marque</Form.Label>
                <Form.Control
                  type="text"
                  name="make"
                  value={vehicleData.make}
                  onChange={handleInputChange}
                  placeholder="Entrer la marque"
                  disabled={!vehicleData.manualEntry}
                />
              </Form.Group>

              <Form.Group controlId="model">
                <Form.Label>Modèle</Form.Label>
                <Form.Control
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleInputChange}
                  placeholder="Entrer le modèle"
                  disabled={!vehicleData.manualEntry}
                />
              </Form.Group>

              <Form.Group controlId="year">
                <Form.Label>Année</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  value={vehicleData.year}
                  onChange={handleInputChange}
                  placeholder="Entrer l'année"
                  disabled={!vehicleData.manualEntry}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                {vehicleData.id ? 'Modifier' : 'Ajouter'} le véhicule
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default GestionVehicules;