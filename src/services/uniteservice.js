import Api from "./Api";

export const createUnite = (data) => Api.post('/unite', data).then(res => res.data);
export const getUnites = () => Api.get('/unite').then(res => res.data);
export const updateUnite = (id,data) => Api.patch('/unite/' + id, data).then(res => res.data);
export const removeUnite = (id) => Api.delete('/unite/'+id).then(res => res.data);