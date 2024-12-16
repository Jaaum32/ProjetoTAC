import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AnimalService from '../Services/AnimalService';

function Animal(){
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [search, setSearch] = useState([]);

    const getAnimals = async () => {
        try {
            const response = await AnimalService.getAll();
            setAnimals(response.data);
            setFilteredAnimals(response.data);
        } catch (err){
            console.log(err);
        }
    }

    useEffect(() => {
        getAnimals();
    }, [])

    useEffect(() => {
        const result = animals.filter(animal => {
            return animal.name.toLowerCase().match(search.toLowerCase());
        })
        setFilteredAnimals(result);
    }, [search])

    const columns = [
        {
            name: 'Id',
            selector: row => row._id,
        },
        {
            name: 'Logo',
            selector: row => <img width={50} src={row.logo} alt=""/>
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Country',
            selector: row => row.country,
        },
        {
            name: 'Website',
            selector: row => row.website,
        },
        {
            name: 'Action',
            cell: row => <button className='btn btn-primary' onClick={() => alert(row._id)}>Edit</button>
        }
    ];



    return(
        <div className="animal">
            <div>
                <h1>Animal Data Components</h1>
                <DataTable 
                    columns={columns} 
                    data={filteredAnimals} 
                    pagination 
                    selectableRows
                    fixedHeader
                    fixedHeaderScrollHeight='480px'
                    actions={
                        <button className='btn btn-primary'>Export</button>
                    }
                    subHeader
                    subHeaderComponent={
                        <input 
                            type="text"
                            placeholder='Search Here'
                            className='form-control w-25'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    }
                />
            </div>
        </div>
    ); 
}

export default Animal;