import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AnimalService from '../Services/AnimalService';
import { FaRegTrashAlt, FaPlus } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import AnimalFormModal from '../Modals/AnimalFormModal';

function Animal() {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal
    const [animalToEdit, setAnimalToEdit] = useState(null); // Para editar um animal ou criar um novo

    const getAnimals = async () => {
        try {
            const response = await AnimalService.getAll();
            setAnimals(response.data);
            setFilteredAnimals(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAnimals();
    }, []);

    useEffect(() => {
        const result = animals.filter(animal => {
            // Verifica se o valor de `search` é uma string antes de aplicar `toLowerCase()`
            const searchTerm = search ? search.toLowerCase() : '';

            // Filtra os animais com base no valor da pesquisa
            return Object.values(animal).some(value =>
                value.toString().toLowerCase().includes(searchTerm)
            );
        });
        setFilteredAnimals(result);
    }, [search, animals]);

    const handleDelete = async (id) => {
        try {
            await AnimalService.delete_(id); // Chama o método de delete
            getAnimals(); // Atualiza a lista após a exclusão
        } catch (err) {
            console.log(err);
            alert('Erro ao excluir o animal.');
        }
    };

    const handleUpdate = (id) => {
        const animal = animals.find(a => a.id === id);
        setAnimalToEdit(animal);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setAnimalToEdit(null); // Criação de um novo animal, portanto sem dados
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setAnimalToEdit(null); // Limpar os dados ao fechar o modal
    };

    const handleSaveSuccess = () => {
        setShowModal(false);  // Fechar o modal após salvar
        getAnimals(); // Atualiza a lista de animais
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Tag ID',
            selector: row => row.tagId,
            sortable: true,
        },
        {
            name: 'Nome',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Raça',
            selector: row => row.breed,
            sortable: true,
        },
        {
            name: 'Idade',
            selector: row => row.age,
            sortable: true,
        },
        {
            name: 'Peso (kg)',
            selector: row => row.weight,
            sortable: true,
        },
        {
            name: 'Status Reprodutivo',
            selector: row => row.reproductiveStatus,
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
        <div className="animal">
            <div>
                <h1>Animals Data</h1>
                <DataTable
                    columns={columns}
                    data={filteredAnimals}
                    pagination
                    fixedHeader
                    fixedHeaderScrollHeight='480px'
                    subHeader
                    subHeaderComponent={
                        <div className='button-container'>
                            <input
                                type="text"
                                placeholder='Pesquise aqui'
                                className='search-input'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaPlus className='btn-icon greenbg' onClick={() => handleAddNew()} />
                        </div>
                    }
                />
            </div>

            <AnimalFormModal
                show={showModal}
                onClose={handleModalClose}
                animalData={animalToEdit}
                onSaveSuccess={handleSaveSuccess}
            />

        </div>
    );
}

export default Animal;