import Api from "./Api";

export const createVenteDetail = (data) => Api.post('/vente-detail', data).then(res => res.data);
export const getVenteDetails = () => Api.get('/vente-detail').then(res => res.data);
export const getVenteDetail = (id) => Api.get('/vente-detail/' + id).then(res => res.data);
export const updateVenteDetail = (id,data) => Api.patch('/vente-detail/' + id, data).then(res => res.data);
export const removeVenteDetail = (id) => Api.delete('/vente-detail/'+id).then(res => res.data);