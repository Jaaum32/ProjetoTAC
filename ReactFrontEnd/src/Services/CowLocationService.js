import axios from "axios";
import { API2_URL } from "../Const";

const getById = (id) => {
    return axios.get(`${API2_URL}/cowlocation/${id}`)
}

// Função para obter todos os animais
const getAll = () => {
    return axios.get(`${API2_URL}/cowlocation`);
};

// Função para salvar um novo animal
const save = (cowLocation) => {
    return axios.post(`${API2_URL}/cowlocation`, cowLocation);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API2_URL}/cowlocation/${id}`);
};

// Função para atualizar um animal pelo ID
const update = (id, cowLocation) => {
    return axios.put(`${API2_URL}/cowlocation/${id}`, cowLocation);
};

export default { getAll, save, delete_, update, getById };