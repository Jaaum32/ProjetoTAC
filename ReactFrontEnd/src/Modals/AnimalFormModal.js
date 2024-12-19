import { useState, useEffect } from 'react';
import AnimalService from '../Services/AnimalService';
import CowLocationService from '../Services/CowLocationService';
import GeofencingService from '../Services/GeofencingService';

function AnimalFormModal({ show, onClose, animalData, onSaveSuccess }) {
  const [tagId, setTagId] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [reproductiveStatus, setReproductiveStatus] = useState('');
  const [selectedGeofence, setSelectedGeofence] = useState('');
  const [geofences, setGeofences] = useState([]);
  const [id, setId] = useState(null);

  // Preencher os dados no formulário se estiver editando
  useEffect(() => {
    if (animalData) {
      setId(animalData.id);
      setTagId(animalData.tagId);
      setName(animalData.name);
      setBreed(animalData.breed);
      setAge(animalData.age);
      setWeight(animalData.weight);
      setReproductiveStatus(animalData.reproductiveStatus);
      setSelectedGeofence(animalData.geofence || '');
    } else {
      // Limpar os campos ao abrir para criação de novo registro
      setId(null);
      setTagId('');
      setName('');
      setBreed('');
      setAge('');
      setWeight('');
      setReproductiveStatus('');
      setSelectedGeofence('');
    }
  }, [animalData]);

  // Buscar geofences para preencher o dropdown
  useEffect(() => {
    async function fetchGeofences() {
      try {
        const response = await GeofencingService.getAll(); // Chamada para a API
        const geofencesData = response.data.map((fence) => ({
          id: fence._id, // Atribuindo o id corretamente
          nome: fence.nome,
        }));
        setGeofences(geofencesData);
      } catch (error) {
        console.error('Erro ao buscar as geofences:', error);
      }
    }
    fetchGeofences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const animal = {
      tagId,
      name,
      breed,
      age,
      weight,
      reproductiveStatus,
      geofence: selectedGeofence,
    };

    try {
      if (id) {
        // Atualizar animal existente
        await AnimalService.update(id, animal);
      } else {
        // Cadastrar novo animal
        await AnimalService.save(animal);
        const defaultLocation = {
          idBoi: animal.tagId,
          latitude: -25.358513,
          longitude: -52.894847,
        };
        try {
          await CowLocationService.save(defaultLocation);
        } catch (error) {
          console.error('Erro ao salvar a localização:', error);
        }
      }
      onSaveSuccess(); // Atualizar a lista no componente pai
      onClose(); // Fechar o modal
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar os dados do animal');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{id ? 'Editar Animal' : 'Cadastrar Animal'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
            <label>Tag ID:</label>
            <input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              required
              placeholder="ID único do animal"
            />
          </div>

          <div>
            <label>Nome:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome do animal"
            />
          </div>

          <div>
            <label>Raça:</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
              placeholder="Raça do animal"
            />
          </div>

          <div>
            <label>Idade:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="0"
              placeholder="Idade em anos"
            />
          </div>

          <div>
            <label>Peso (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="0"
              placeholder="Peso do animal em kg"
            />
          </div>

          <div>
            <label>Status Reprodutivo:</label>
            <input
              type="text"
              value={reproductiveStatus}
              onChange={(e) => setReproductiveStatus(e.target.value)}
              required
              placeholder="Ex: Ativo, Inativo"
            />
          </div>

          <div>
            <label>Cerca Geográfica:</label>
            <select
              value={selectedGeofence}
              onChange={(e) => setSelectedGeofence(e.target.value)}
              required
            >
              <option value="">Selecione uma cerca</option>
              {geofences.map((geofence) => (
                <option key={geofence.id} value={geofence.nome}>
                  {geofence.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <button type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnimalFormModal;
