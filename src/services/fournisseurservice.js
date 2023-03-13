import Api from "./Api";

export const createFournisseur = (data) => Api.post('/fournisseur', data).then(res => res.data);
export const getFournisseurs = () => Api.get('/fournisseur').then(res => res.data);
export const getFournisseur = (id) => Api.get('/fournisseur/' + id).then(res => res.data);
export const updateFournisseur = (id,data) => Api.patch('/fournisseur/' + id, data).then(res => res.data);
export const removeFournisseur = (id) => Api.delete('/fournisseur/'+id).then(res => res.data);