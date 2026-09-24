export const ADD_APPOINTMENT = 'ADD_APPOINTMENT';
// Import des constantes d'action
export const ADD_APPOINTMENT_REQUEST = 'ADD_APPOINTMENT_REQUEST';
export const ADD_APPOINTMENT_SUCCESS = 'ADD_APPOINTMENT_SUCCESS';
export const ADD_APPOINTMENT_FAILURE = 'ADD_APPOINTMENT_FAILURE';

export const LOAD_APPOINTMENTS = 'LOAD_APPOINTMENTS';
export const LOAD_RDVS_SUCCESS = 'LOAD_RDVS_SUCCESS';
export const LOAD_RDVS_FAILURE = 'LOAD_RDVS_FAILURE';

export const MODIFY_RDV_REQUEST = 'MODIFY_RDV_REQUEST';
export const MODIFY_RDV_SUCCESS = 'MODIFY_RDV_SUCCESS';
export const MODIFY_RDV_FAILURE = 'MODIFY_RDV_FAILURE';

export const DELETE_RDV_REQUEST = 'DELETE_RDV_REQUEST';
export const DELETE_RDV_SUCCESS = 'DELETE_RDV_SUCCESS';
export const DELETE_RDV_FAILURE = 'DELETE_RDV_FAILURE';

export const UPDATE_RDV_SUCCESS = 'UPDATE_RDV_SUCCESS';
export const UPDATE_RDV_FAILURE = 'UPDATE_RDV_FAILURE';

export const APPROVE_MODIFICATION_REQUEST = 'APPROVE_MODIFICATION_REQUEST';
export const APPROVE_MODIFICATION_SUCCESS = 'APPROVE_MODIFICATION_SUCCESS';
export const APPROVE_MODIFICATION_FAILURE = 'APPROVE_MODIFICATION_FAILURE';

export const REJECT_MODIFICATION_REQUEST = 'REJECT_MODIFICATION_REQUEST';
export const REJECT_MODIFICATION_SUCCESS = 'REJECT_MODIFICATION_SUCCESS';
export const REJECT_MODIFICATION_FAILURE = 'REJECT_MODIFICATION_FAILURE';

export const ADD_PAYMENT_TO_RDV_REQUEST = 'ADD_PAYMENT_TO_RDV_REQUEST';
export const ADD_PAYMENT_TO_RDV_SUCCESS = 'ADD_PAYMENT_TO_RDV_SUCCESS';
export const ADD_PAYMENT_TO_RDV_FAILURE = 'ADD_PAYMENT_TO_RDV_FAILURE';
// Action pour ajouter un rendez-vous
export const addAppointment = (appointment) => (dispatch, getState) => {
  dispatch({ type: ADD_APPOINTMENT_REQUEST });

  try {
    const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur
    appointment.idClient = userId;

    const currentAppointments = getState().appointments.appointments || [];
    appointment.id = currentAppointments.length > 0 
      ? currentAppointments[currentAppointments.length - 1].id + 1 
      : 1;

    const updatedAppointments = [...currentAppointments, appointment];
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    dispatch({
      type: ADD_APPOINTMENT_SUCCESS,
      payload: appointment,
    });
  } catch (error) {
    dispatch({
      type: ADD_APPOINTMENT_FAILURE,
      error: error.message,
    });
  }
};

// Charger les rendez-vous depuis le localStorage
export const loadAppointments = () => {
  return (dispatch) => {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    dispatch({
      type: LOAD_APPOINTMENTS,
      payload: appointments,
    });
  };
};

// Charger les rendez-vous spécifiques à l'utilisateur
export const loadRdvs = () => {
  return (dispatch) => {
    try {
      const userId = localStorage.getItem('userId');
      const allRdvs = JSON.parse(localStorage.getItem('appointments')) || [];
      const userRdvs = allRdvs.filter(rdv => rdv.idClient === userId);

      dispatch({ type: LOAD_RDVS_SUCCESS, payload: userRdvs });
    } catch (error) {
      dispatch({ type: LOAD_RDVS_FAILURE, error: error.message });
    }
  };
};

// Supprimer un rendez-vous
export const deleteRdv = (id) => {
  return (dispatch) => {
    dispatch({ type: DELETE_RDV_REQUEST });

    try {
      let rdvs = JSON.parse(localStorage.getItem('appointments')) || [];
      rdvs = rdvs.filter(rdv => parseInt(rdv.id, 10) !== parseInt(id, 10));
      localStorage.setItem('appointments', JSON.stringify(rdvs));

      dispatch({ type: DELETE_RDV_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: DELETE_RDV_FAILURE, error: error.message });
    }
  };
};

// Mettre à jour le statut d'un rendez-vous (accepter ou refuser)
export const updateRdvStatus = (id, status, reason, details) => {
  return (dispatch) => {
    try {
      let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      let rdvCible = appointments.find(rdv => rdv.id === parseInt(id));

      if (rdvCible === undefined) {
        const error = 'Rendez-vous non trouvé.';
        dispatch({ type: "UPDATE_RDV_STATUS_FAILURE", error });
        return; // Arrête l'exécution si le rendez-vous n'est pas trouvé
      }

      console.log('rdvCible avant modification', rdvCible);

      // Mettre à jour le statut et les détails du rendez-vous
      appointments = appointments.map(rdv => {
        if (rdv.id === parseInt(id)) {
          console.log("Rendez-vous trouvé et mise à jour en cours");
          rdv.status = status;
          if (reason != null) {
            rdv.reason = reason;
          }
          if (details != null) {
            rdv.details = details;
          }
          rdvCible = rdv;
        }
        return rdv;
      });

      console.log("Mise à jour terminée pour le rendez-vous :", rdvCible);

      // Sauvegarder les modifications dans le localStorage
      localStorage.setItem('appointments', JSON.stringify(appointments));

      // Dispatch de succès avec le rendez-vous mis à jour
      dispatch({ type: "UPDATE_RDV_STATUS_SUCCESS", payload: rdvCible });
      
      // Recharger l’état des rendez-vous si nécessaire
      dispatch(loadAppointments());

    } catch (error) {
      dispatch({ type: "UPDATE_RDV_STATUS_FAILURE", error: error.message });
    }
  };
};


// Modifier un rendez-vous
export const modifyRdv = (rdvData) => {
  return (dispatch) => {
    dispatch({ type: MODIFY_RDV_REQUEST });

    try {
      let rdvs = JSON.parse(localStorage.getItem('appointments')) || [];
      const rdvExists = rdvs.some(rdv => rdv.id === rdvData.id);

      if (rdvExists) {
        rdvs = rdvs.map((rdv) => (rdv.id === rdvData.id ? rdvData : rdv));
        localStorage.setItem('appointments', JSON.stringify(rdvs));

        dispatch({ type: MODIFY_RDV_SUCCESS, payload: rdvData });
      } else {
        throw new Error("Le rendez-vous n'existe pas.");
      }
    } catch (error) {
      dispatch({ type: MODIFY_RDV_FAILURE, error: error.message });
    }
  };
};


// Approuver une modification de rendez-vous
export const approveModification = (id) => {
  return (dispatch) => {
    dispatch({ type: APPROVE_MODIFICATION_REQUEST });

    try {
      let rdvs = JSON.parse(localStorage.getItem('appointments')) || [];
      const modifiedRdv = rdvs.find(rdv => rdv.id === id && rdv.modified);

      if (modifiedRdv) {
        modifiedRdv.modified = false;
        localStorage.setItem('appointments', JSON.stringify(rdvs));
        dispatch({ type: APPROVE_MODIFICATION_SUCCESS, payload: modifiedRdv });
      } else {
        dispatch({ type: APPROVE_MODIFICATION_FAILURE, error: 'Rendez-vous non trouvé.' });
      }
    } catch (error) {
      dispatch({ type: APPROVE_MODIFICATION_FAILURE, error: error.message });
    }
  };
};

// Refuser une modification de rendez-vous
export const rejectModification = (id, reason) => {
  return (dispatch) => {
    dispatch({ type: REJECT_MODIFICATION_REQUEST });

    try {
      let rdvs = JSON.parse(localStorage.getItem('appointments')) || [];
      const modifiedRdv = rdvs.find(rdv => rdv.id === id && rdv.modified);

      if (modifiedRdv) {
        modifiedRdv.status = 'Refusé';
        modifiedRdv.reason = reason;
        localStorage.setItem('appointments', JSON.stringify(rdvs));
        dispatch({ type: REJECT_MODIFICATION_SUCCESS, payload: modifiedRdv });
      } else {
        dispatch({ type: REJECT_MODIFICATION_FAILURE, error: 'Rendez-vous modifié non trouvé.' });
      }
    } catch (error) {
      dispatch({ type: REJECT_MODIFICATION_FAILURE, error: error.message });
    }
  };
};
export const addPaymentToRdv = (rdvId, paymentId) => {
  return (dispatch) => {
    dispatch({ type: 'ADD_PAYMENT_TO_RDV_REQUEST' });
    console.log('Ajout de paiement pour le rendez-vous ans add payment', rdvId);

    try {
      console.log('Début de addPaymentToRdv');
      let rdvs = JSON.parse(localStorage.getItem('appointments')) || [];
      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

      let rdv = rdvs.find((rdv) => parseInt(rdv.id) === parseInt(rdvId));
      console.log('Rendez-vous trouvé pour le paiement:', rdv);
      if (rdv) {
        // Mettre à jour l'ID de paiement et le statut dans le rendez-vous
        rdv.idPayment = paymentId;
        rdv.status = 'Payé';

        // Ajouter la réparation au véhicule associé
        let vehicle = vehicles.find((vehicle) => parseInt(vehicle.id)=== parseInt(rdv.vehicleId));
        if (vehicle) {
          const newRepair = {
            date: new Date().toLocaleDateString(),
            description: rdv.service,
            cost: rdv.details.costEstimate || 0,
          };

          // Vérification avant l'ajout de la réparation
          console.log(`Avant ajout, réparations pour le véhicule ${vehicle.id}:`, vehicle.repairs);

          // Ajouter l'entrée de réparation dans le véhicule
          vehicle.repairs = vehicle.repairs ? [...vehicle.repairs, newRepair] : [newRepair];

          // Vérification après l'ajout de la réparation
          console.log(`Après ajout, réparations pour le véhicule ${vehicle.id}:`, vehicle.repairs);

          // Sauvegarder les modifications dans localStorage pour le véhicule
          localStorage.setItem('vehicles', JSON.stringify(vehicles));

          // Dispatch Redux pour mettre à jour l'état avec la nouvelle réparation
          dispatch({
            type: 'ADD_REPAIR_TO_VEHICLE_SUCCESS',
            payload: { vehicleId: vehicle.id, repair: newRepair },
          });
        }

        // Sauvegarder la mise à jour des rendez-vous dans localStorage
        localStorage.setItem('appointments', JSON.stringify(rdvs));

        dispatch({ type: 'ADD_PAYMENT_TO_RDV_SUCCESS', payload: rdv });
      } else {
        console.log('Rendez-vous introuvable.');
        dispatch({ type: 'ADD_PAYMENT_TO_RDV_FAILURE', error: 'Rendez-vous introuvable.' });
      }
    } catch (error) {
      console.error('Erreur dans addPaymentToRdv:', error.message);
      dispatch({ type: 'ADD_PAYMENT_TO_RDV_FAILURE', error: error.message });
    }
  };
};