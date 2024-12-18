import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, useMapEvents } from 'react-leaflet';
import CowLocationService from '../Services/CowLocationService';
import GeofencingService from '../Services/GeofencingService';

function Geofencing() {
    const [geofence, setGeofences] = useState([]);
    const [cowLocation, setCowLocations] = useState([]);
    //const [filteredAnimals, setFilteredAnimals] = useState([]);
    //const [search, setSearch] = useState('');

    const getGeofences = async () => {
        try {
            const response = await GeofencingService.getAll();
            setGeofences(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getCowLocation = async () => {
        try {
            const response = await CowLocationService.getAll();
            setCowLocations(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getGeofences();
        getCowLocation();
    }, []);

    const position = [-25.357623, -52.895425]; // Coordenadas iniciais do mapa

    // Coordenadas do polígono inicial
    const [polygons, setPolygons] = useState([
        [
            [-25.357847, -52.895928],
            [-25.358172, -52.896091],
            [-25.359083, -52.895673],
            [-25.359119, -52.895072],
            [-25.358022, -52.895309],
            [-25.358187, -52.895700],
        ],
    ]);

    // Coordenadas do polígono em edição
    const [currentPolygon, setCurrentPolygon] = useState([]);
    const [isAdding, setIsAdding] = useState(false); // Controle de modo de edição

    // Coordenadas para marcadores dentro do polígono
    const markers = [
        { position: [-25.358000, -52.895900], label: "Ponto A" },
        { position: [-25.358500, -52.895500], label: "Ponto B" },
        { position: [-25.358900, -52.895300], label: "Ponto C" },
    ];

    // Estilo do polígono
    const polygonOptions = {
        color: 'blue',
        fillColor: 'lightblue',
        fillOpacity: 0.5,
    };

    // Componente para capturar cliques no mapa
    const ClickHandler = () => {
        useMapEvents({
            click(e) {
                if (isAdding) {
                    const { lat, lng } = e.latlng;
                    setCurrentPolygon((prev) => [...prev, [lat, lng]]); // Adiciona o ponto clicado
                }
            },
        });
        return null;
    };

    // Finalizar o desenho do polígono e salvá-lo
    const finalizePolygon = () => {
        if (currentPolygon.length > 2) {
            setPolygons((prev) => [...prev, currentPolygon]);
            setCurrentPolygon([]);
            setIsAdding(false);
        } else {
            alert("Um polígono precisa de pelo menos 3 pontos.");
        }
    };

    // Cancelar a criação do polígono
    const cancelPolygon = () => {
        setCurrentPolygon([]);
        setIsAdding(false);
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                {/* Botão para adicionar um novo limite */}
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)}>Adicionar Novo Limite</button>
                )}
                {isAdding && (
                    <>
                        <button onClick={finalizePolygon}>Confirmar Limite</button>
                        <button onClick={cancelPolygon}>Cancelar</button>
                    </>
                )}
            </div>

            <MapContainer
                center={position}
                zoom={16}
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
                {polygons.map((polygon, index) => (
                    <Polygon
                        key={index}
                        positions={polygon}
                        pathOptions={polygonOptions}
                    >
                        <Popup>Limite {index + 1}</Popup>
                    </Polygon>
                ))}

                {/* Polígono em construção */}
                {currentPolygon.length > 0 && (
                    <Polygon
                        positions={currentPolygon}
                        pathOptions={{ color: "green", fillColor: "lightgreen", fillOpacity: 0.5 }}
                    >
                        <Popup>Polígono em construção</Popup>
                    </Polygon>
                )}

                {/* Adicionando marcadores no terreno */}
                {markers.map((marker, index) => (
                    <CircleMarker
                        key={index}
                        center={marker.position}
                        radius={5}
                        pathOptions={{
                            color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.7,
                        }}
                    >
                        <Popup>{marker.label}</Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}

export default Geofencing;