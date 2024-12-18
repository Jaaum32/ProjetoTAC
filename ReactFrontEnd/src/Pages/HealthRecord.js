import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegTrashAlt, FaPlus } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import HealthRecordFormModal from '../Modals/HealthRecordFormModal';
import HealthRecordService from '../Services/HealthRecordService';

function HealthRecord() {
    const [healthRecords, setHealthRecords] = useState([]);
    const [filteredHealthRecords, setFilteredHealthRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal
    const [healthRecordToEdit, setHealthRecordToEdit] = useState(null); // Para editar um registro de saúde ou criar um novo

    const getHealthRecords = async () => {
        try {
            const response = await HealthRecordService.getAll();
            setHealthRecords(response.data);
            setFilteredHealthRecords(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getHealthRecords(); // Carregar todos os registros ao montar o componente
    }, []);

    useEffect(() => {
        const result = healthRecords.filter(record => {
            const searchTerm = search ? search.toLowerCase() : '';
            return Object.values(record).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            );
        });
        setFilteredHealthRecords(result);
    }, [search, healthRecords]);

    const handleDelete = async (id) => {
        try {
            await HealthRecordService.delete_(id);
            getHealthRecords(); // Atualiza a lista após exclusão
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir o registro de saúde.');
        }
    };

    const handleUpdate = (id) => {
        const record = healthRecords.find(r => r.id === id);
        setHealthRecordToEdit(record);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setHealthRecordToEdit(null); // Novo registro
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setHealthRecordToEdit(null); // Limpar ao fechar o modal
    };

    const handleSaveSuccess = () => {
        setShowModal(false);
        getHealthRecords(); // Atualiza a lista após salvar
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Tag ID do Animal',
            selector: row => row.animalId,
            sortable: true,
        },
        {
            name: 'Data de Registro',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Tratamento',
            selector: row => row.treatment,
            sortable: true,
        },
        {
            name: 'Responsável',
            selector: row => row.responsible,
            sortable: true,
        },
        {
            name: 'Ações',
            cell: row => (
                <div className='button-container'>
                    <HiPencilAlt className='btn-icon bluebg' onClick={() => handleUpdate(row.id)} />
                    <FaRegTrashAlt className='btn-icon redbg' onClick={() => handleDelete(row.id)} />
                </div>
            )
        }
    ];

    return (
        <div className="health-record">
            <div>
                <h2>Registros de Saúde</h2>
                <DataTable
                    columns={columns}
                    data={filteredHealthRecords}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight="480px"
                    subHeader
                    subHeaderComponent={
                        <div className='button-container'>
                            <input
                                type="text"
                                placeholder="Pesquise aqui"
                                className="search-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaPlus className='btn-icon greenbg' onClick={handleAddNew} />
                        </div>
                    }
                />
            </div>

            <HealthRecordFormModal
                show={showModal}
                onClose={handleModalClose}
                healthRecordData={healthRecordToEdit}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
}

export default HealthRecord;
