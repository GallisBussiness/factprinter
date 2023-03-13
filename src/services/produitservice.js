import Api from "./Api";

export const createProduit = (data) => Api.post('/produits', data).then(res => res.data);
export const getProduits = () => Api.get('/produits').then(res => res.data);
export const updateProduit = (id,data) => Api.patch('/produits/' + id, data).then(res => res.data);
export const removeProduit = (id) => Api.delete('/produits/'+id).then(res => res.data);