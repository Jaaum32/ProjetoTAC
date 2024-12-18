import axios from "axios";
import { API1_URL } from "../Const";

const getById = (id) => {
    return axios.get(`${API1_URL}/animal/${id}`)
}

// Função para obter todos os animais
const getAll = () => {
    return axios.get(`${API1_URL}/animal`);
};

// Função para salvar um novo animal
const save = (animal) => {
    return axios.post(`${API1_URL}/animal`, animal);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API1_URL}/animal/${id}`);
};

// Função para atualizar um animal pelo ID
const update = (id, animal) => {
    return axios.put(`${API1_URL}/animal/${id}`, animal);
};

export default { getAll, save, delete_, update, getById };