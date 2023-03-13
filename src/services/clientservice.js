import Api from "./Api";

export const createClient = (data) => Api.post('/client', data).then(res => res.data);
export const getClients = () => Api.get('/client').then(res => res.data);
export const getClient = (id) => Api.get('/client/' + id).then(res => res.data);
export const updateClient = (id,data) => Api.patch('/client/' + id, data).then(res => res.data);
export const removeClient = (id) => Api.delete('/client/'+id).then(res => res.data);