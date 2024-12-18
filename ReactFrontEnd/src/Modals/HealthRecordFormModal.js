import { useState, useEffect } from 'react';
import HealthRecordService from '../Services/HealthRecordService';

function HealthRecordFormModal({ show, onClose, healthRecordData, onSaveSuccess }) {
  const [date, setDate] = useState('');
  const [treatment, setTreatment] = useState('');
  const [responsible, setResponsible] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [id, setId] = useState(null);

  // Preencher os dados no formulário se estiver editando
  useEffect(() => {
    console.log("healthRecordData:", healthRecordData); 
    if (healthRecordData) {
        setId(healthRecordData.id);
        setDate(healthRecordData.date);
        setTreatment(healthRecordData.treatment);
        setResponsible(healthRecordData.responsible);
        setAnimalId(healthRecordData.animalId);
    } else {
        console.log("healthRecordData: foi pro krl", healthRecordData); 
        setId(null);
        setDate('');
        setTreatment('');
        setResponsible('');
        setAnimalId('');
    }
}, [healthRecordData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const healthRecord = {
      date,
      treatment,
      responsible,
      animalId,
    };

    try {
      if (id) {
        // Atualizar registro de saúde existente
        await HealthRecordService.update(id, healthRecord);
      } else {
        // Cadastrar novo registro de saúde
        await HealthRecordService.save(healthRecord);
      }
      onSaveSuccess();  // Atualizar a lista no componente pai
      onClose();  // Fechar o modal
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar os dados do registro de saúde');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{id ? 'Editar Registro de Saúde' : 'Cadastrar Registro de Saúde'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
            <label>Data:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Tratamento:</label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              required
              placeholder="Tratamento realizado"
            />
          </div>

          <div>
            <label>Responsável:</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              required
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label>ID do Animal:</label>
            <input
              type="text"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              required
              placeholder="ID do animal relacionado"
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

export default HealthRecordFormModal;
