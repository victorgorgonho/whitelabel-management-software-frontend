import axios from 'axios';
import { environment } from '../environment/environment';

const api = axios.create({
  baseURL: environment.REACT_APP_API_URL,
});

export default api;
