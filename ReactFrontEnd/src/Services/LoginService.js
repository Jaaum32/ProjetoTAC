import axios from "axios";
import { API1_URL } from "../Const";

const post = (username, password) => {
    return axios.post(`${API1_URL}/auth`, { username, password });
}

export default { post };