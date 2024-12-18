import { useState, useEffect } from 'react';
import AnimalService from '../Services/AnimalService';

function AnimalFormModal({ show, onClose, animalData, onSaveSuccess }) {
  const [tagId, setTagId] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [reproductiveStatus, setReproductiveStatus] = useState('');
  const [id, setId] = useState(null);

  // Preencher os dados no formulário se estiver editando
  useEffect(() => {
    console.log("animalData:", animalData); 
    if (animalData) {
      setId(animalData.id);
      setTagId(animalData.tagId);
      setName(animalData.name);
      setBreed(animalData.breed);
      setAge(animalData.age);
      setWeight(animalData.weight);
      setReproductiveStatus(animalData.reproductiveStatus);
    } else {
      // Limpar os campos ao abrir para criação de novo registro
      setId(null);
      setTagId('');
      setName('');
      setBreed('');
      setAge('');
      setWeight('');
      setReproductiveStatus('');
    }
  }, [animalData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const animal = {
      tagId,
      name,
      breed,
      age,
      weight,
      reproductiveStatus
    };

    try {
      if (id) {
        // Atualizar animal existente
        await AnimalService.update(id, animal);
        // alert('Animal atualizado com sucesso!');
      } else {
        // Cadastrar novo animal
        await AnimalService.save(animal);
        // alert('Animal cadastrado com sucesso!');
      }
      onSaveSuccess();  // Atualizar a lista no componente pai
      onClose();  // Fechar o modal
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
