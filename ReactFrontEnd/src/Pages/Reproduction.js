import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegTrashAlt, FaPlus } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import ReproductionFormModal from '../Modals/ReproductionFormModal';
import ReproductionService from '../Services/ReproductionService';

function Reproduction() {
    const [reproductions, setReproductions] = useState([]);
    const [filteredReproductions, setFilteredReproductions] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal
    const [reproductionToEdit, setReproductionToEdit] = useState(null); // Para editar uma reprodução ou criar uma nova

    const getReproductions = async () => {
        try {
            const response = await ReproductionService.getAll();
            setReproductions(response.data);
            setFilteredReproductions(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getReproductions(); // Carregar todos os registros ao montar o componente
    }, []);

    useEffect(() => {
        const result = reproductions.filter(reproduction => {
            const searchTerm = search ? search.toLowerCase() : '';
            return Object.values(reproduction).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            );
        });
        setFilteredReproductions(result);
    }, [search, reproductions]);

    const handleDelete = async (id) => {
        try {
            await ReproductionService.delete_(id);
            getReproductions(); // Atualiza a lista após exclusão
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir o registro de reprodução.');
        }
    };

    const handleUpdate = (id) => {
        const reproduction = reproductions.find(r => r.id === id);
        setReproductionToEdit(reproduction);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setReproductionToEdit(null); // Novo registro
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setReproductionToEdit(null); // Limpar ao fechar o modal
    };

    const handleSaveSuccess = () => {
        setShowModal(false);
        getReproductions(); // Atualiza a lista após salvar
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
            name: 'Data de Inseminação',
            selector: row => row.inseminationDate,
            sortable: true,
        },
        {
            name: 'Data Prevista para Nascimento',
            selector: row => row.expectedBirthDate,
            sortable: true,
        },
        {
            name: 'Confirmação de Gravidez',
            selector: row => (row.pregnancyConfirmed ? 'Confirmada' : 'Não Confirmada'),
            sortable: true,
        },
        {
            name: 'Observações',
            selector: row => row.observations,
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
        <div className="reproduction">
            <div>
                <h2>Registros de Reprodução</h2>
                <DataTable
                    columns={columns}
                    data={filteredReproductions}
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

            <ReproductionFormModal
                show={showModal}
                onClose={handleModalClose}
                reproductionData={reproductionToEdit}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
}

export default Reproduction;
