import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Services from './Components/Services';
import Contact from './Components/Contact';
import Login from './Components/Login';
import Client from './Components/Client';  
import Mecanicien from './Components/Mecanicien'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilClient from './Components/ProfilClient'
import ProfilMecanicien from './Components/ProfileMecanicien';
import GestionVehicules from './Components/GestionVehicules';
import Appointments from './Components/Appointments';
import AnnuaireMecaniciens from './Components/AnnuaireMecaniciens';
import MechanicAppointments from './Components/MecanicienAppointments';
import ClientAppointments from './Components/ClientAppointments';
import Payment from './Components/Payemnt';
import Bills from './Components/Bills';
import MechanicBills from './Components/MecanicienBills';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client" element={<Client/>} />  {/* Route pour Client */}
        <Route path="/mecanicien" element={<Mecanicien />} />  {/* Route pour Mecanicien */}
        <Route path="/client-profile" element={<ProfilClient/>} />
        <Route path="/mecanicien-profile" element={<ProfilMecanicien/>} />
        <Route path="/gestionVehicules" element={<GestionVehicules/>} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/annuaireMecaniciens" element={<AnnuaireMecaniciens />} />
        <Route path="/manage-appointments" element={<MechanicAppointments/>} />
        <Route path="/mes-rendezvous" element={<ClientAppointments />}/>
        <Route path="/payments/:rdvId" element={<Payment />}/>
        <Route path="/bills" element={<Bills />}/>
        <Route path="/mecanicien-bills" element={<MechanicBills/>}/>
        <Route path="*" element={<h1 className="text-center mt-5">Page non trouvée</h1>} /> {/* Page non trouvée */}
      </Routes>
    </Router>
  );
}

export default App;
