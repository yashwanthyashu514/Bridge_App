import axios from 'axios'

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || '';
  if (url && !url.endsWith('/api')) {
    url = url.endsWith('/') ? `${url}api` : `${url}/api`;
  }
  return url || '/api';
};

const api = axios.create({
  baseURL: getBaseURL()
})



api.interceptors.request.use(config => {
  const token = localStorage.getItem('parent_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('parent_token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api
