import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import CowLocationService from '../Services/CowLocationService';
import GeofencingService from '../Services/GeofencingService';
import DataTable from 'react-data-table-component';
import { FaRegTrashAlt } from 'react-icons/fa';

function Geofencing() {
    const [geofences, setGeofences] = useState([]); // Polígonos carregados da API
    const [cowLocations, setCowLocations] = useState([]); // Localizações dos animais da API
    const [currentPolygon, setCurrentPolygon] = useState([]); // Polígono em edição
    const [isAdding, setIsAdding] = useState(false); // Controle de modo de edição
    const [name, setName] = useState(""); // Campo de nome
    const [description, setDescription] = useState(""); // Campo de descrição

    // Função para buscar geofences da API
    const getGeofences = async () => {
        try {
            const response = await GeofencingService.getAll(); // Chamada para a API
            const formattedGeofences = response.data.map((fence) => ({
                coordenadas: fence.coordenadas.map(coord => [coord.latitude, coord.longitude]), // Formatação para Leaflet
                id: fence._id, // Atribuindo o id corretamente
                nome: fence.nome,
                descricao: fence.descricao,
                corTerreno: fence.corTerreno,
                pontoCentral: fence.pontoCentral
            }));

            setGeofences(formattedGeofences);
        } catch (err) {
            console.error("Erro ao carregar geofences:", err);
        }
    };

    const getCowLocations = async () => {
        try {
            const response = await CowLocationService.getAll();
            const formattedLocations = response.data.map((location) => ({
                position: [location.latitude, location.longitude],
                label: `Boi ${location.idBoi}`,
            }));
            setCowLocations(formattedLocations);
        } catch (err) {
            console.error("Erro ao carregar localizações dos animais:", err);
        }
    };

    // Atualizando as geofences e as localizações dos bois com base no efeito
    useEffect(() => {
        const fetchData = async () => {
            await getGeofences(); // Carregar os geofences
            await getCowLocations(); // Carregar as localizações dos bois
        };

        // Chama a função de atualização a cada 5 segundos (5000 ms)
        const intervalId = setInterval(fetchData, 500);
        console.log(geofences);
        // Chama a função imediatamente ao montar o componente
        fetchData();

        // Limpa o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, []); // [] garante que o useEffect seja chamado apenas uma vez ao montar o componente

    // Estilo dos polígonos
    const polygonOptions = {
        color: 'rgb(255,0,0)',//geofences.terrenoColor,//pegar o RGB
        fillColor: 'rgb(255,0,0)',
        fillOpacity: 0.2,
    };

    // Função para salvar o novo polígono no banco de dados
    const saveGeofence = async (polygon) => {
        try {
            if (!polygon || polygon.length < 3) {
                alert("Um polígono precisa de pelo menos 3 pontos.");
                return;
            }

            // Formatar as coordenadas do polígono
            const formattedCoordinates = polygon.map(coord => ({
                latitude: coord[0],
                longitude: coord[1],
            }));

            // Criar o objeto no formato esperado pela API, incluindo os campos de nome e descrição
            const geofenceData = {
                nome: name, // Agora usa o nome do campo
                descricao: description, // Agora usa a descrição do campo
                coordenadas: formattedCoordinates,
            };

            // Enviar para a API
            const response = await GeofencingService.save(geofenceData);

            // Atualizar a lista de geofences após salvar
            //console.log(response);
            //console.log(formattedCoordinates);

            // Atualizar as geofences
            await getGeofences();
            setCurrentPolygon([]); // Limpar o polígono atual
            setIsAdding(false); // Desabilitar o modo de adição
            setName(""); // Limpar o campo de nome
            setDescription(""); // Limpar o campo de descrição
        } catch (err) {
            console.error("Erro ao salvar o limite:", err.response ? err.response.data : err.message);
            alert("Erro ao salvar o limite. Verifique o console para mais detalhes.");
        }
    };

    // Função para excluir um polígono
    const deleteGeofence = async (id) => {
        try {
            // Confirmar a exclusão
            const confirmDelete = window.confirm("Você tem certeza que deseja excluir este limite?");
            if (confirmDelete) {
                // Excluir o polígono através da API
                await GeofencingService.delete_(id);

                // Atualizar a lista de geofences após a exclusão
                setGeofences(prev => prev.filter(fence => fence.id !== id));
            }
        } catch (err) {
            console.error("Erro ao excluir o limite:", err.response ? err.response.data : err.message);
            alert("Erro ao excluir o limite. Verifique o console para mais detalhes.");
        }
    };

    // Componente para capturar cliques no mapa
    const ClickHandler = () => {
        useMapEvents({
            click(e) {
                if (isAdding) {
                    const { lat, lng } = e.latlng;
                    setCurrentPolygon(prev => [...(prev || []), [lat, lng]]);
                }
            },
        });
        return null;
    };

    // Finalizar o desenho do polígono e salvá-lo
    const finalizePolygon = () => {
        try {
            if (currentPolygon.length >= 3) {
                saveGeofence(currentPolygon); // Salvar o polígono com coordenadas válidas
            } else {
                alert("Um polígono precisa de pelo menos 3 pontos.");
            }
            setCurrentPolygon([]); // Limpar o polígono atual
            setIsAdding(false); // Desabilitar o modo de adição
        } catch (error) {
            alert(error);
        }
    };

    // Cancelar a criação do polígono
    const cancelPolygon = () => {
        setCurrentPolygon([]); // Limpar o polígono atual
        setIsAdding(false); // Desabilitar o modo de adição
    };


    const columns = [
        {
            name: 'Nome',
            selector: row => row.nome,
            sortable: true,
        },
        {
            name: 'Descrição',
            selector: row => row.descricao,
            sortable: true,
        },
        {
            name: 'Ações',
            cell: row => (
                <div className='button-container'>
                    <FaRegTrashAlt className='btn-icon redbg' onClick={() => deleteGeofence(row.id)} />
                </div>
            )
        }
    ];

    return (
        <div className='map-page'>
            <div className='container-map'>
                {/* Container para o mapa */}
                <MapContainer
                    center={[-25.357623, -52.895425]} // Coordenadas iniciais do mapa
                    zoom={20}
                    style={{ height: "70vh", width: "100%" }}
                >
                    {/* TileLayer de imagens de satélite */}
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> contributors'
                    />

                    {/* Captura cliques no mapa */}
                    <ClickHandler />

                    {/* Polígonos existentes */}
                    {geofences && geofences.length > 0 && geofences.map((fence, index) => (
                        <Polygon
                            key={index}
                            positions={fence.coordenadas} // Usando coordenadas corretamente
                            pathOptions={polygonOptions}
                        >
                            <Popup>{fence.nome}</Popup>
                        </Polygon>
                    ))}

                    {/* Polígono em construção */}
                    {currentPolygon && currentPolygon.length > 0 && (
                        <Polygon
                            positions={currentPolygon}
                            pathOptions={{ color: "green", fillColor: "lightgreen", fillOpacity: 0.5 }}
                        >
                            <Popup>Polígono em construção</Popup>
                        </Polygon>
                    )}

                    {/* Marcadores para localizações dos animais */}
                    {cowLocations && cowLocations.length > 0 && cowLocations.map((marker, index) => (
                        <CircleMarker
                            key={index}
                            center={marker.position}
                            radius={5}
                            pathOptions={{
                                color: 'blue',
                                fillColor: 'blue',
                                fillOpacity: 0.6,
                            }}
                        >
                            <Popup>{marker.label}</Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>

                {/* Botões e campos de nome/descrição */}
                <div className="geofence-buttons">
                    {!isAdding ? (
                        <button onClick={() => setIsAdding(true)} className="bluebg modal-buttons">
                            Adicionar Limite
                        </button>
                    ) : (
                        <div className='container-limit-add'>
                            <div className='geofence-buttons container-limit-buttons'>
                                <button onClick={finalizePolygon} className="greenbg modal-buttons">
                                    Finalizar Limite
                                </button>
                                <button onClick={cancelPolygon} className="redbg modal-buttons">
                                    Cancelar
                                </button>
                            </div>

                            {/* Campos de nome e descrição */}
                            <div className='container-limit-fields'>
                                <div>
                                    <label>Nome:</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}

                                    />
                                </div>
                                <div>
                                    <label>Descrição:</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}

                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='map-tables'>
                <DataTable
                    columns={columns}
                    data={geofences} // Dados da tabela
                    pagination
                />
            </div>
        </div>
    );
}

export default Geofencing;
