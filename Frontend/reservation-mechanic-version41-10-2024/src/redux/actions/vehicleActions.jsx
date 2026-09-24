import axios from 'axios';

// Ajouter un véhicule manuellement
export const addVehicle = (vehicleData) => {
  return (dispatch) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Utilisateur non connecté.');

      vehicleData.userId = userId;
      vehicleData.repairs = []; // Initialiser le champ repairs
      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

      // Vérifier si le véhicule existe déjà
      const vehicleExists = vehicles.some(vehicle => 
        vehicle.vin === vehicleData.vin && 
        vehicle.make === vehicleData.make && 
        vehicle.model === vehicleData.model && 
        vehicle.year === vehicleData.year &&
        vehicle.userId === userId
      );

      if (vehicleExists) {
        alert('Ce véhicule existe déjà.');
        return;
      }

      // Ajouter le véhicule s'il n'existe pas
      vehicleData.id = vehicles.length > 0 ? vehicles[vehicles.length - 1].id + 1 : 1;
      vehicles.push(vehicleData);
      localStorage.setItem('vehicles', JSON.stringify(vehicles));

      dispatch({ type: 'ADD_VEHICLE_SUCCESS', payload: vehicleData });
    } catch (error) {
      dispatch({ type: 'ADD_VEHICLE_FAILURE', error: error.message });
    }
  };
};

// Rechercher par VIN via l'API NHTSA
export const searchVehicleByVin = (vin) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_VEHICLE_REQUEST' });
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);

      // Vérifier la réponse API dans la console
      console.log('API Response:', response.data);

      // Filtrer les résultats pour obtenir les données nécessaires
      const make = response.data.Results.find(r => r.Variable === 'Make');
      const model = response.data.Results.find(r => r.Variable === 'Model');
      const year = response.data.Results.find(r => r.Variable === 'Model Year');

      if (make && model && year) {
        // Générer un ID unique pour le véhicule
        const newVehicleId = Date.now();

        const vehicleData = {
          id: newVehicleId,
          make: make.Value,
          model: model.Value,
          year: year.Value,
          vin: vin,
          userId: localStorage.getItem('userId'),
          repairs: [] // Initialiser les réparations
        };

        // Ajouter le véhicule au localStorage
        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        vehicles.push(vehicleData);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));

        dispatch({ type: 'ADD_VEHICLE_SUCCESS', payload: vehicleData });
        dispatch(loadVehicles());
      } else {
        dispatch({ type: 'FETCH_VEHICLE_FAILURE', error: 'Informations du véhicule introuvables.' });
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error.message);
      dispatch({ type: 'FETCH_VEHICLE_FAILURE', error: error.message });
    }
  };
};

// Rechercher par marque, modèle et année via l'API NHTSA
export const searchVehicleByDetails = (make, model, year) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_VEHICLE_REQUEST' });
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
      
      const vehicleData = {
        id: Date.now(),
        make: response.make,
        model: response.model,
        year: response.year,
        vin: '',
        userId: localStorage.getItem('userId'),
        repairs: [] // Initialiser les réparations
      };

      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      vehicles.push(vehicleData);
      localStorage.setItem('vehicles', JSON.stringify(vehicles));

      dispatch({ type: 'ADD_VEHICLE_SUCCESS', payload: vehicleData });
      dispatch(loadVehicles());
    } catch (error) {
      dispatch({ type: 'FETCH_VEHICLE_FAILURE', error: error.message });
    }
  };
};

// Charger les véhicules spécifiques à l'utilisateur depuis le localStorage
export const loadVehicles = () => {
  return (dispatch) => {
    try {
      const userId = localStorage.getItem('userId');
      const allVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      const userVehicles = allVehicles.filter(vehicle => vehicle.userId === userId);

      console.log('Véhicules avec réparations chargés pour l\'utilisateur:', userVehicles); // Debug
      dispatch({ type: 'LOAD_VEHICLES_SUCCESS', payload: userVehicles });
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      dispatch({ type: 'LOAD_VEHICLES_FAILURE', error: error.message });
    }
  };
};


// Modifier un véhicule
export const editVehicle = (vehicleData) => {
  return (dispatch) => {
    try {
      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      vehicles = vehicles.map(vehicle =>
        vehicle.id === vehicleData.id ? vehicleData : vehicle
      );
      localStorage.setItem('vehicles', JSON.stringify(vehicles));

      dispatch({ type: 'EDIT_VEHICLE_SUCCESS', payload: vehicleData });
    } catch (error) {
      dispatch({ type: 'EDIT_VEHICLE_FAILURE', error: error.message });
    }
  };
};

// Supprimer un véhicule
export const deleteVehicle = (id) => {
  return (dispatch) => {
    try {
      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      vehicles = vehicles.filter(vehicle => vehicle.id !== id);
      localStorage.setItem('vehicles', JSON.stringify(vehicles));

      dispatch({ type: 'DELETE_VEHICLE_SUCCESS', payload: id });
    } catch (error) {
      dispatch({ type: 'DELETE_VEHICLE_FAILURE', error: error.message });
    }
  };
};
