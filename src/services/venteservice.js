import Api from "./Api";

export const createVente = (data) => Api.post('/facture', data).then(res => res.data);
export const getVentes = () => Api.get('/facture').then(res => res.data);
export const getVentesByDate = (data) => Api.post('/facture/bydate',data).then(res => res.data);
export const getVentesByClient = (id) => Api.get('/facture/byclient/' + id).then(res => res.data);
export const getVente = (id) => Api.get('/facture/'+ id).then(res => res.data);
export const updateVente = (id,data) => Api.patch('/facture/' + id, data).then(res => res.data);
export const removeVente = (id) => Api.delete('/facture/'+id).then(res => res.data);