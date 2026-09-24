import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AnnuaireMecaniciens = ({ onSelectMechanic }) => {
  const [mecaniciens, setMecaniciens] = useState([]);

  // Charger les mécaniciens depuis le localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const mecaniciensList = storedUsers.filter(user => user.userType === 'mecanicien');
    setMecaniciens(mecaniciensList);
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center">Annuaire des Mécaniciens</h2>
      <Row>
        {mecaniciens.map((mecanicien) => (
          <Col md={4} key={mecanicien.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{`${mecanicien.firstName} ${mecanicien.lastName}`}</Card.Title>
                <Card.Text>
                  <strong>Spécialité:</strong> {mecanicien.specialite || 'Non spécifiée'}
                </Card.Text>
                <Card.Text>
                  <strong>Disponibilité:</strong> {mecanicien.disponibilite || 'Non spécifiée'}
                </Card.Text>
                <Button variant="primary" onClick={() => onSelectMechanic(mecanicien)}>
                  Réserver
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AnnuaireMecaniciens;