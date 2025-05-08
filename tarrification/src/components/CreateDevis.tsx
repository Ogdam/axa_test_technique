import React, { useReducer, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateDevis.css';
import { fetchData, fetchPost, fetchDelete } from '../utils/fetch';
import { Button } from '@mui/material';
import AlertComp from './AlertComp.tsx';

const initialState = {
  numero: '',
  nom_client: '',
  type_de_garantie: '',
  destination: '',
  type_de_travaux: '',
  cout: '',
  existant: false,
  vip: false,
  rmco: false,
  taux_trc: '',
  taux_do: '',
  prime_seul_trc: '',
  prime_seul_do: '',
  prime_seul_duo: '',
  adresse_chantier: '',
  garanties_dommages_ouvrage: '',
  garanties_responsabilité_civile: '',
  garanties_maintenance_visite: '',
  garanties_mesure_conservatoire: '',
  franchises_dommages_ouvrage: '',
  franchises_assure_maître_ouvrage: '',
  franchises_maintenance_visite: '',
  descriptions: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ALL_FIELDS':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function CreateDevis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [infoMessage, setInfoMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    if (id) {
      const fetchDevis = async () => {
        try {
          const data = await fetchData(`/tarrification/opportunites/${id}/`);
          dispatch({ type: 'SET_ALL_FIELDS', payload: data });
        } catch (error) {
          console.error('Erreur lors du fetch des données:', error);
        }
      };
      fetchDevis();
    }
  }, [id]);

  useEffect(() => {
    const parsedCoutOuvrage = parseFloat(state.cout) || 0;
    if (state.type_de_garantie === 'DO') {
      const primeDO = (parsedCoutOuvrage * (parseFloat(state.taux_do) || 0)).toFixed(2);
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_do', value: primeDO });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_trc', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_duo', value: primeDO });
    } else if (state.type_de_garantie === 'TRC') {
      const primeTRC = (parsedCoutOuvrage * (parseFloat(state.taux_trc) || 0)).toFixed(2);
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_trc', value: primeTRC });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_do', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_duo', value: primeTRC });
    } else if (state.type_de_garantie === 'TRCDO') {
      const primeTRC = parsedCoutOuvrage * (parseFloat(state.taux_trc) || 0);
      const primeDO = parsedCoutOuvrage * (parseFloat(state.taux_do) || 0);
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_trc', value: primeTRC.toFixed(2) });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_do', value: primeDO.toFixed(2) });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_duo', value: (primeTRC + primeDO).toFixed(2) });
    } else {
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_trc', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_do', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'prime_seul_duo', value: '' });
    }
  }, [state.type_de_garantie, state.taux_trc, state.taux_do, state.cout]);

  const handleSubmit = () => {
    const DevisData = { ...state };
    Object.keys(DevisData).forEach((key) => {
      if (DevisData[key] === '') {
        DevisData[key] = null;
      }
    });

    if (id) {
      fetchPost(`/tarrification/opportunites/${id}/`, DevisData, 'put')
        .then(() => {
          setInfoMessage('Devis mis à jour avec succès.');
          setTimeout(() => setInfoMessage(''), 5000);
        })
        .catch(() => {
          setErrorMessage('Erreur lors de la mise à jour du devis.');
          setTimeout(() => setErrorMessage(''), 5000);
        });
    } else {
      fetchPost(`/tarrification/opportunites/`, DevisData, 'post')
        .then((response) => {
          navigate('/devis/' + response.id);
          setInfoMessage('Devis créé avec succès.');
          setTimeout(() => setInfoMessage(''), 5000);
        })
        .catch(() => {
          setErrorMessage('Erreur lors de la création du devis.');
          setTimeout(() => setErrorMessage(''), 5000);
        });
    }
  };

  const handleDelete = () => {
    if (id) {
      fetchDelete(`/tarrification/opportunites/${id}/`)
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          setErrorMessage('Erreur lors de la suppression du devis.');
          setTimeout(() => setErrorMessage(''), 5000);
        });
    }
  };

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="container axa-TableCell eme">
      
      <AlertComp errorMessage={errorMessage} infoMessage={infoMessage}/>

      <h2 className="axa-title">{id ? "Modification Devis N°"+state.numero : "Nouveau Devis"}</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="numeroOpportunite">Numéro d’Opportunité:</label>
          <input
            type="text"
            id="numeroOpportunite"
            value={state.numero}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'numero', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nomClient">Nom du Client:</label>
          <input
            type="text"
            id="nomClient"
            value={state.nom_client}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'nom_client', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="typeGarantie">Type de Garantie:</label>
          <select
            id="typeGarantie"
            value={state.type_de_garantie}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'type_de_garantie', value: e.target.value })}
            className="axa-input"
          >
            <option value="">Sélectionner</option>
            <option value="DO">DO</option>
            <option value="TRC">TRC</option>
            <option value='TRCDO'>DUO (DO + TRC)</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="destinationOuvrage">Destination de l'Ouvrage:</label>
          <select
            id="destinationOuvrage"
            value={state.destination}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'destination', value: e.target.value })}
            className="axa-input"
          >
            <option value="">Sélectionner</option>
            <option value="HAB">Habitation</option>
            <option value="HHAB">Hors Habitation</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="typesTravaux">Types de Travaux:</label>
          <select
            id="typesTravaux"
            value={state.type_de_travaux}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'type_de_travaux', value: e.target.value })}
            className="axa-input"
          >
            <option value="">Sélectionner</option>
            <option value="LR">Rénovation légère</option>
            <option value="LD">Rénovation lourde</option>
            <option value="ON">Ouvrage neuf</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="coutOuvrage">Coût de l'Ouvrage:</label>
          <input
            type="number"
            id="coutOuvrage"
            value={state.cout}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'cout', value: e.target.value })}
            className="axa-input"
          />
        </div>
      </div>

      <div className="form-row">
        {(state.type_de_garantie === 'DO' || state.type_de_garantie === 'TRCDO') && (
          <div className="form-group">
            <label htmlFor="primeSeulDO">Prime Seul DO:</label>
            <input
              type="text"
              id="primeSeulDO"
              value={state.prime_seul_do}
              readOnly
              className="axa-input"
            />
          </div>
        )}
        {(state.type_de_garantie === 'DO' || state.type_de_garantie === 'TRCDO') && (
          <div className="form-group">
            <label htmlFor="tauxSeulDO">Taux Seul DO:</label>
            <input
              type="number"
              id="tauxSeulDO"
              value={state.taux_do}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'taux_do', value: e.target.value })}
              className="axa-input"
            />
          </div>
        )}
        {( state.type_de_garantie === 'TRC' || state.type_de_garantie === 'TRCDO') && (
        <div className="form-group">
          <label htmlFor="primeSeulTRC">Prime Seul TRC:</label>
          <input
            type="text"
              id="primeSeulTRC"
            value={state.prime_seul_trc}
            readOnly
            className="axa-input"
          />
        </div>
      )}
        {(state.type_de_garantie === 'TRC' || state.type_de_garantie === 'TRCDO') && (
          <div className="form-group">
            <label htmlFor="tauxSeulTRC">Taux Seul TRC:</label>
            <input
              type="number"
              id="tauxSeulTRC"
              value={state.taux_trc}
              onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'taux_trc', value: e.target.value })}
              className="axa-input"
            />
          </div>
        )}
        {(state.type_de_garantie === 'TRCDO') && (
          <div className="form-group">
            <label htmlFor="primeDUO">Prime DUO:</label>
            <input
              type="text"
              id="primeDUO"
              value={state.prime_seul_duo}
              readOnly
              className="axa-input"
            />
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="clientVIP">Votre Client est-il un VIP?</label>
          <input
            type="checkbox"
            id="clientVIP"
            checked={state.vip}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'vip', value: e.target.checked })}
            className="axa-checkbox"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rCMO">Souhaitez-vous la RCMO?</label>
          <input
            type="checkbox"
            id="rCMO"
            checked={state.rmco}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'rmco', value: e.target.checked })}
            className="axa-checkbox"
          />
        </div>
        <div className="form-group">
          <label htmlFor="existant">Existant</label>
          <input
            type="checkbox"
            id="existant"
            checked={state.existant}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'existant', value: e.target.checked })}
            className="axa-checkbox"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="adresseChantier">Adresse du Chantier:</label>
          <input
            type="text"
            id="adresseChantier"
            value={state.adresse_chantier}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'adresse_chantier', value: e.target.value })}
            className="axa-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="garantiesDO">Garanties Dommages Ouvrage:</label>
          <input
            type="number"
            id="garantiesDO"
            value={state.garanties_dommages_ouvrage}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'garanties_dommages_ouvrage', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="garantiesRC">Garanties Responsabilité Civile:</label>
          <input
            type="number"
            id="garantiesRC"
            value={state.garanties_responsabilité_civile}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'garanties_responsabilité_civile', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="garantiesMaintenance">Garanties Maintenance Visite:</label>
          <input
            type="number"
            id="garantiesMaintenance"
            value={state.garanties_maintenance_visite}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'garanties_maintenance_visite', value: e.target.value })}
            className="axa-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="garantiesConservatoire">Garanties Mesure Conservatoire:</label>
          <input
            type="number"
            id="garantiesConservatoire"
            value={state.garanties_mesure_conservatoire}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'garanties_mesure_conservatoire', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="franchisesDO">Franchises Dommages Ouvrage:</label>
          <input
            type="number"
            id="franchisesDO"
            value={state.franchises_dommages_ouvrage}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'franchises_dommages_ouvrage', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="franchisesAssure">Franchises Assuré Maître Ouvrage:</label>
          <input
            type="number"
            id="franchisesAssure"
            value={state.franchises_assure_maître_ouvrage}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'franchises_assure_maître_ouvrage', value: e.target.value })}
            className="axa-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="franchisesMaintenance">Franchises Maintenance Visite:</label>
          <input
            type="number"
            id="franchisesMaintenance"
            value={state.franchises_maintenance_visite}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'franchises_maintenance_visite', value: e.target.value })}
            className="axa-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="descriptions">Descriptions:</label>
          <textarea
            id="descriptions"
            value={state.descriptions}
            onChange={(e) =>  dispatch({ type: 'SET_FIELD', field: 'descriptions', value: e.target.value })}
            className="axa-input"
          />
        </div>
      </div>
      
      <div>
          <Button variant="contained" onClick={handleReturn} style={{ left: '-10px' }}>Retour</Button>
          <Button variant="contained" onClick={handleSubmit} > Valider</Button>
          { id && <Button variant="contained" onClick={handleDelete} style={{ right:'-10px' }} color="error">Supprimer</Button> }
          
      </div>
    </div>
  );
}

export default CreateDevis;