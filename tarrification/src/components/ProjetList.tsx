import React, { useState, useEffect } from 'react';
import './styles.css';
import { fetchData } from '../utils/fetch';
import Logo_AXA from '../assets/images/Logo_AXA.svg';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { API_BASE_URL } from "../config";
import {Table, TableBody, TableHead, TableCell, TableRow, Button, MenuItem, Select  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AlertComp from './AlertComp.tsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import UpdateIcon from '@mui/icons-material/Update';

function ProjetList() {
  const [projets, setProjets] = useState([]);
  const [filTableRowes, setFilTableRowes] = useState({});
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const loadData = async () => {
    try {
     const result = await fetchData('/tarrification/opportunites/');
     setProjets(result);        
   } catch (err) {
     console.error("Erreur lors de la récupération des projets:", err);
   }
 };

  useEffect(() => {
    loadData()
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilTableRowes({ ...filTableRowes, [name]: value });
  };

  const filteredProjets = projets.filter(projet => {
    return Object.keys(filTableRowes).every(key => {
      if (key === 'destination')
        if (filTableRowes[key] === 'ALL')
          return true;
        if (filTableRowes[key] === 'HAB')
          return projet[key] === 'HAB'
        if (filTableRowes[key] === 'HHAB')
          return projet[key] === 'HHAB'
      
      const projetValue = projet[key]?.toString().toLowerCase() || '';
      const filTableRoweValue = filTableRowes[key]?.toLowerCase() || '';
      return projetValue.includes(filTableRoweValue);
    });
  });

  const handleChangeHabitationFiltre = (event) => {
    const { value } = event.target;
    setFilTableRowes({ ...filTableRowes, destination: value });
  }

  const handleNewDevisClick = () => {
    navigate('/devis/');
  };

  const handleUpdateDevisClick = (id) => {
    navigate('/devis/' + id);
  };

  return (
    <div className="projet-list-container">

      <AlertComp errorMessage={errorMessage} infoMessage={infoMessage}/>

      <h2 className="axa-title">
        <img src={Logo_AXA} alt="logo" />
        Liste des Projets et Devis
      </h2>
      <div className="btn">
        <Button variant="contained" onClick={handleNewDevisClick}>
          Nouveau devis
        </Button>
      </div>
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="numero">N° Opportunité:</label>
          <input
            type="text"
            id="numero"
            name="numero"
            onChange={handleFilterChange}
            className="projet-list-input"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="nom_client">Nom du Client:</label>
          <input
            type="text"
            id="nom_client"
            name="nom_client"
            onChange={handleFilterChange}
            className="projet-list-input"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="destination">Destination:</label>
          <Select
            className="projet-list-input"
            name="destination"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filTableRowes.destination}
            onChange={handleChangeHabitationFiltre}
          >
            <MenuItem value={"HAB"}>Habitation</MenuItem>
            <MenuItem value={"HHAB"}>Hors Habitation</MenuItem>
            <MenuItem value={"ALL"}>Tous</MenuItem>
          </Select>
        </div>
      </div>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>N° Opportunité</TableCell>
            <TableCell>Nom du Client</TableCell>
            <TableCell>Tarif Proposé</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProjets.map((projet) => (
            <TableRow key={projet.id}>
              <TableCell>{projet.numero}</TableCell>
              <TableCell>{projet.nom_client}</TableCell>
              <TableCell>{projet.cout} €</TableCell>
              <TableCell>
                {projet.destination === "HAB" ? "Habitation" : "Hors habitation"}
              </TableCell>
              <TableCell>
              <IconButton
                  aria-label="download"
                  component="a"
                  onClick={() => handleUpdateDevisClick(projet.id)}
                >
                  <UpdateIcon />
                </IconButton>
                <IconButton
                  aria-label="download"
                  component="a"
                  href={
                    API_BASE_URL +
                    "/tarrification/opportunites/" +
                    projet.id +
                    "/export/pdf/"
                  }
                >
                  <PictureAsPdfIcon />
                </IconButton>
                <IconButton
                  aria-label="download"
                  component="a"
                  href={
                    API_BASE_URL +
                    "/tarrification/opportunites/" +
                    projet.id +
                    "/export/docx/"
                  }
                >
                  <DescriptionIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  component="a"
                  onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
                      fetch(API_BASE_URL + "/tarrification/opportunites/" + projet.id + "/", {
                        method: 'DELETE',
                      })
                      .then(response => {
                        if (response.ok) {
                          setProjets(projets.filter(p => p.id !== projet.id));
                          setInfoMessage('Devis supprimé avec succès.');
                          setTimeout(() => setInfoMessage(''), 5000);
                        } else {
                          setErrorMessage('Erreur lors de la suppression du devis.');
                          setTimeout(() => setErrorMessage(''), 5000);
                          console.error("Erreur lors de la suppression du projet:", response.statusText);
                        }
                      })
                      .catch(error =>{
                        setErrorMessage('Erreur lors de la suppression du devis.');
                        setTimeout(() => setErrorMessage(''), 5000);
                      });
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>         
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProjetList;