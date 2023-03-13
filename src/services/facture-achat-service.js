import Api from "./Api";

export const createFactureAchat = (data) => Api.post('/facture-achat', data).then(res => res.data);
export const getFactureAchats = () => Api.get('/facture-achat').then(res => res.data);
export const getFactureAchatByFournisseur = (id) => Api.get('/facture-achat/byfournisseur/' + id).then(res => res.data);
export const getFactureAchat = (id) => Api.get('/facture-achat/' + id).then(res => res.data);
export const updateFactureAchat = (id,data) => Api.patch('/facture-achat/' + id, data).then(res => res.data);
export const removeFactureAchat = (id) => Api.delete('/facture-achat/'+id).then(res => res.data);