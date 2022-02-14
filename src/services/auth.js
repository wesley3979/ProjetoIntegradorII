function getToken(){
  const token = localStorage.getItem('token');
  
  if(token === null) return null;

  return token;
}

export const auth = {
  headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
  }
}