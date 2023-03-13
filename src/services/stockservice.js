import Api from "./Api";

export const EntreeStock = (data) => Api.post('/stock/entree', data).then(res => res.data);
export const SortieStock = (data) => Api.post('/stock/sortie', data).then(res => res.data);
export const getStocks = () => Api.get('/stock').then(res => res.data);
export const updateStock = (id,data) => Api.patch('/stock/' + id, data).then(res => res.data);
export const removeStock = (id) => Api.delete('/stock/'+id).then(res => res.data);