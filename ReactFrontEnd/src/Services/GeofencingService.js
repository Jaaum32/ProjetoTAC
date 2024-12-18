import axios from "axios";
import { API2_URL } from "../Const";

const getById = (id) => {
    return axios.get(`${API2_URL}/geofence/${id}`)
}

// Função para obter todos os animais
const getAll = () => {
    return axios.get(`${API2_URL}/geofence`);
};

// Função para salvar um novo animal
const save = (geofence) => {
    return axios.post(`${API2_URL}/geofence`, geofence);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API2_URL}/geofence/${id}`);
};

// Função para atualizar um animal pelo ID
const update = (id, geofence) => {
    return axios.put(`${API2_URL}/geofence/${id}`, geofence);
};

export default { getAll, save, delete_, update, getById };