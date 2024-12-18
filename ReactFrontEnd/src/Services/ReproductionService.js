import axios from "axios";
import { API1_URL } from "../Const";

// Função para obter todos os animais
const getAll = () => {
    return axios.get(`${API1_URL}/reproduction`);
};

// Função para salvar um novo animal
const save = (reproduction) => {
    return axios.post(`${API1_URL}/reproduction`, reproduction);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API1_URL}/reproduction/${id}`);
};

// Função para atualizar um animal pelo ID
const update = (id, reproduction) => {
    return axios.put(`${API1_URL}/reproduction/${id}`, reproduction);
};

export default { getAll, save, delete_, update };