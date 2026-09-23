import React, { useState, useEffect } from 'react';
import AnnuaireMecaniciens from './AnnuaireMecaniciens';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { Container, Form, Button, Alert, Navbar, Nav } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { loadVehicles } from '../redux/actions/vehicleActions';
import { addAppointment, loadAppointments } from '../redux/actions/appointmentActions';
import { Link, useNavigate } from 'react-router-dom';

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vehicles = useSelector((state) => state.vehicles.vehicles);
  //const appointments = useSelector((state) => state.appointments.appointments);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState('');
  const [step, setStep] = useState(1);

  // Liste des services offerts
  const servicesList = [
    'Réparation de freins',
    'Changement d\'huile',
    'Diagnostic électronique',
    'Remplacement de pneus',
  ];

  useEffect(() => {
    dispatch(loadVehicles());
    dispatch(loadAppointments());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMechanic || !selectedVehicle || !selectedDate || !selectedService) {
      alert('Veuillez remplir tous les champs !');
      return;
    }

    const clientDetails = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log(selectedVehicle);
    console.log("Selected Vehicle ID:", selectedVehicle);
    console.log("Vehicles array:", vehicles);
    const selectedVehicleDetails = vehicles.find(vehicle => vehicle.id === parseInt(selectedVehicle, 10));

    const newAppointment = {
      mechanicId: selectedMechanic.id,
      mechanicName: `${selectedMechanic.firstName} ${selectedMechanic.lastName}`,
      vehicleId: selectedVehicle,
      vehicleMake: selectedVehicleDetails.make,
      vehicleModel: selectedVehicleDetails.model,
      vehicleYear: selectedVehicleDetails.year,
      date: selectedDate,
      service: selectedService,
      clientName: `${clientDetails.firstName} ${clientDetails.lastName}`,
      clientEmail: clientDetails.email,
    };

    // Ajouter le rendez-vous et rediriger
    dispatch(addAppointment(newAppointment));
    alert('Rendez-vous pris avec succès !');
    navigate('/client'); 
  };

  const handleMechanicSelect = (mechanic) => {
    setSelectedMechanic(mechanic);
    setStep(2);
  };

  const handleLogout = () => {
    // Déconnexion
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };
  
  return (
    <>
      {/* Navbar Section */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="client-logo-text">Mon Espace Client</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/client">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/client-profile">Mon Profil</Nav.Link>
              <Nav.Link as={Link} to="/gestionVehicules">Mes Véhicules</Nav.Link>
              <Nav.Link as={Link} to="/bills">Mes Factures</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="my-5">
        <h1 className="text-center mb-4">Planifier un Rendez-vous</h1>

        {step === 1 && (
          <AnnuaireMecaniciens onSelectMechanic={handleMechanicSelect} />
        )}

        {step === 2 && selectedMechanic && (
          <div className="mt-4">
            <Alert variant="success" className="text-center mb-4">
              Mécanicien sélectionné : {selectedMechanic.firstName} {selectedMechanic.lastName}
            </Alert>

            <Form onSubmit={handleSubmit} className="p-4 shadow-sm bg-light rounded">
              <Form.Group controlId="selectDate" className="mb-4">
                <Form.Label>Sélectionner une date et une heure</Form.Label>
                <Datetime
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inputProps={{ placeholder: 'Choisir une date et une heure' }}
                  className="w-100"
                />
              </Form.Group>

              <Form.Group controlId="selectVehicle" className="mb-4">
                <Form.Label>Sélectionner un Véhicule</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  required
                >
                  <option value="">Choisir un véhicule...</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="selectService" className="mb-4">
                <Form.Label>Sélectionner un service</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">Choisir un service...</option>
                  {servicesList.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Confirmer le Rendez-vous
              </Button>
            </Form>
          </div>
        )}
      </Container>
    </>
  );
};

export default Appointments;