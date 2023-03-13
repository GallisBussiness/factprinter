import Api from "./Api";

export const createFactureVente = (data) => Api.post('/facture-vente', data).then(res => res.data);
export const getFactureVentes = () => Api.get('/facture-vente').then(res => res.data);
export const getFactureVenteByClient = (id) => Api.get('/facture-vente/byclient/' + id).then(res => res.data);
export const getFactureVente = (id) => Api.get('/facture-vente/' + id).then(res => res.data);
export const updateFactureVente = (id,data) => Api.patch('/facture-vente/' + id, data).then(res => res.data);
export const removeFactureVente = (id) => Api.delete('/facture-vente/'+id).then(res => res.data);