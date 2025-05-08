import { API_BASE_URL } from "../config";

const fetchData = async (url) => {
    try {
      const response = await fetch(API_BASE_URL+url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      throw error; // Propagez l'erreur pour que le composant React puisse la gérer
    }
  };

  const fetchPost = async (url, body, method) => {
    console.log(JSON.stringify(body));
    try {
      const response = await fetch(API_BASE_URL + url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      throw error;
    }
  };

  const fetchDelete = async (url) => {
    try {
      const response = await fetch(API_BASE_URL + url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      throw error; // Propagez l'erreur pour que le composant React puisse la gérer
    }
  };


export { fetchData, fetchPost, fetchDelete };
