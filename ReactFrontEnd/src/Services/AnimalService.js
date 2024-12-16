import axios from "axios";
import { API_URL } from "../Const";

const getAll = () => {
    return axios.get(`${API_URL}`);
}

 const save = (user) => {
//     return axios.post(`${API_URL}`, user);
 }

export default { getAll, save }