import { useState, useEffect } from 'react';
import AnimalService from '../Services/AnimalService';
import ReproductionService from '../Services/ReproductionService'; // Serviço para gerenciar a reprodução

function ReproductionFormModal({ show, onClose, reproductionData, onSaveSuccess }) {
  const [inseminationDate, setInseminationDate] = useState('');
  const [expectedBirthDate, setExpectedBirthDate] = useState('');
  const [observations, setObservations] = useState('');
  const [pregnancyConfirmed, setPregnancyConfirmed] = useState(false);
  const [id, setId] = useState(null);
  const [animalId, setAnimalId] = useState('');

  // Preencher os dados no formulário se estiver editando
  useEffect(() => {
    if (reproductionData) {
      setId(reproductionData.id);
      setInseminationDate(reproductionData.inseminationDate);
      setExpectedBirthDate(reproductionData.expectedBirthDate);
      setObservations(reproductionData.observations);
      setPregnancyConfirmed(reproductionData.pregnancyConfirmed);
      setAnimalId(reproductionData.animalId); // Se necessário, preenche o animal vinculado
    } else {
      // Limpar os campos ao abrir para criação de novo registro
      setId(null);
      setInseminationDate('');
      setExpectedBirthDate('');
      setObservations('');
      setPregnancyConfirmed(false);
      setAnimalId('');
    }
  }, [reproductionData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reproduction = {
      inseminationDate,
      expectedBirthDate,
      observations,
      pregnancyConfirmed,
      animalId
    };

    try {
      if (id) {
        // Atualizar reprodução existente
        await ReproductionService.update(id, reproduction);
      } else {
        // Cadastrar nova reprodução
        await ReproductionService.save(reproduction);
      }
      onSaveSuccess();  // Atualizar a lista no componente pai
      onClose();  // Fechar o modal
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar os dados da reprodução');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{id ? 'Editar Reprodução' : 'Cadastrar Reprodução'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
            <label>Data de Inseminação:</label>
            <input
              type="date"
              value={inseminationDate}
              onChange={(e) => setInseminationDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Data Esperada para o Nascimento:</label>
            <input
              type="date"
              value={expectedBirthDate}
              onChange={(e) => setExpectedBirthDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Observações:</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações sobre a reprodução"
            />
          </div>

          <div className='checkbox-container'>
            <label>Confirmação de Gravidez:</label>
            <input
              type="checkbox"
              checked={pregnancyConfirmed}
              onChange={(e) => setPregnancyConfirmed(e.target.checked)}
            />
          </div>

          <div>
            <label>ID do Animal:</label>
            <input
              type="text"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              placeholder="ID do animal associado"
              required
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

export default ReproductionFormModal;