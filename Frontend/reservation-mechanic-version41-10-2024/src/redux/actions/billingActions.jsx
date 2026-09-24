export const calculateBillAmount = (rdv) => {
  console.log('Calcul du montant de la facture pour le rendez-vous :', rdv);
  const costEstimate = parseFloat(rdv.details.costEstimate); // Convertir en nombre
  console.log(costEstimate);
  if (typeof costEstimate === 'number' && !Number.isNaN(costEstimate) && !Number.isInteger(costEstimate)) {
    console.error('Erreur : costEstimate n\'est pas un nombre valide ici.');
    return null;}
  const taxRate = 0.15; // Taxe de 15 % 
  const totalWithTax = costEstimate * (1 + taxRate);
  console.log("Taxe",totalWithTax);
  console.log("Montant avec taxe fix :",totalWithTax.toFixed(2));
  return totalWithTax.toFixed(2); // Retourner le montant avec 2 décimales
};

// Ajouter une facture (bill)
export const addBill = (billData, rdvId) => {
  return (dispatch) => {
    dispatch({ type: 'ADD_BILL_REQUEST' });

    try {
      // Récupérer les factures existantes
      let bills = JSON.parse(localStorage.getItem('bills')) || [];
      console.log('Début ajout bill, le rendez-vous :', rdvId);
      let rdv = JSON.parse(localStorage.getItem('appointments')) || [];
      console.log('Les rendez-vous :', rdv);
      rdv = rdv.find((rdv) => rdv.id.toString() === rdvId.toString());
      console.log('Le rendez-vous :', rdv);
      // Créer une nouvelle facture
      const newBill = {
        id: bills.length > 0 ? bills[bills.length - 1].id + 1 : 1,
        date: new Date().toLocaleString(),
        montant: calculateBillAmount(rdv), // Calculer le montant total
        vehicule: billData.vehicule,
        idClient: billData.idClient,
      };
      console.log('Fin calcul montant');
      console.log('Le montant :', newBill.montant);
      // Ajouter la facture à la liste et la stocker dans le localStorage
      bills.push(newBill);
      localStorage.setItem('bills', JSON.stringify(bills));
      console.log('Fin ajout bill');

      dispatch({ type: 'ADD_BILL_SUCCESS', payload: newBill });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'ADD_BILL_FAILURE', error: error.message });
    }
  };
};

  // Récupérer les factures par idClient
  export const fetchBills = (idClient) => {
    return (dispatch) => {
      dispatch({ type: 'FETCH_BILLS_REQUEST' });
  
      try {
        let bills = JSON.parse(localStorage.getItem('bills')) || [];
        const userBills = bills.filter((bill) => bill.idClient === idClient);
  
        dispatch({ type: 'FETCH_BILLS_SUCCESS', payload: userBills });
      } catch (error) {
        dispatch({ type: 'FETCH_BILLS_FAILURE', error: error.message });
      }
    };
  };
  // action pour récupérer les facteur des clients pour mecanicien
  export const fetchMechanicBills = (mechanicId) => {
    return (dispatch) => {
      dispatch({ type: 'FETCH_BILLS_REQUEST' });
  
      try {
        const allBills = JSON.parse(localStorage.getItem('bills')) || [];
        const mechanicBills = allBills.filter(bill => bill.mechanicId && bill.mechanicId === mechanicId);
  
        dispatch({ type: 'FETCH_MECHANIC_BILLS_SUCCESS', payload: mechanicBills });
      } catch (error) {
        dispatch({ type: 'FETCH_BILLS_FAILURE', error: error.message });
      }
    };
  };
  