import { api } from './api'
import { toast } from 'react-toastify'
import { auth } from './auth'

export const requests = {
  login: async (data) => {
    try{
      let result = await api.post('/user/login', data);

      localStorage.setItem('token', result.data.token);

      toast.success(result.data.message);
      return {
        userId: result.data.id
      }
    }catch(e){
      toast.error(e.response.data.message)
    }
  },
  getUserById: async (id) => {
    let { data } = await api.get(`/user/${id}`, auth);
    
    return data;
  }
}