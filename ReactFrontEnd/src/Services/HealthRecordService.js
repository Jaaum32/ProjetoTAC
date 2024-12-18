import axios from "axios";
import { API1_URL } from "../Const";

// Função para obter todos os animais
const getAll = () => {
    return axios.get(`${API1_URL}/healthrecord`);
};

// Função para salvar um novo animal
const save = (healthrecord) => {
    return axios.post(`${API1_URL}/healthrecord`, healthrecord);
};

// Função para excluir um animal pelo ID
const delete_ = (id) => {
    return axios.delete(`${API1_URL}/healthrecord/${id}`);
};

// Função para atualizar um animal pelo ID
const update = (id, healthrecord) => {
    return axios.put(`${API1_URL}/healthrecord/${id}`, healthrecord);
};

export default { getAll, save, delete_, update };