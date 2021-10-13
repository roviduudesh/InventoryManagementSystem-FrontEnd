import axios from "axios";

const KEYS ={
    suppliers: 'suppliers',
    supplierId: 'supplierId'
}

export const getDepartmentCollection = () => ([
    {id: '1', title:'Development'},
    {id: '2', title:'Marketing'},
    {id: '3', title:'IT'},
    {id: '4', title:'Accounting'},
    {id: '5', title:'HR'},
    {id: '6', title:'Finance'}
])

export function insertSupplier(data){
    let suppliers = getAllSuppliers();
    data['id'] = generateSupplierId();
    suppliers.push(data);
    localStorage.setItem(KEYS.suppliers, JSON.stringify(suppliers))
}

export function updateSupplier(data){
    let suppliers = getAllSuppliers();
    let recordIndex = suppliers.findIndex(x => x.id == data.id);
    suppliers[recordIndex] = { ...data}
    localStorage.setItem(KEYS.suppliers, JSON.stringify(suppliers))
}

export function deleteSupplier(id){
    let suppliers = getAllSuppliers();
    suppliers = suppliers.filter(x => x.id != id)
    localStorage.setItem(KEYS.suppliers, JSON.stringify(suppliers))
}

export function generateSupplierId(){
    if(localStorage.getItem(KEYS.supplierId) == null){
        localStorage.setItem(KEYS.supplierId, '0')
    }
    var id = parseInt(localStorage.getItem(KEYS.supplierId))
    localStorage.setItem(KEYS.supplierId, (++id).toString())
    return id;
}

export function getAllSuppliers(){
    if(localStorage.getItem(KEYS.suppliers) == null){
        localStorage.setItem(KEYS.suppliers, JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem(KEYS.suppliers));
}

export async function getAllSuppliersAPI(){
    let list = {};
    await axios.get('http://localhost:8080/api/v1/supplier/all')
        .then((function (response){
            // console.log(response.data.data)
            list =  response.data.data;
        }))
    console.log(list)
    return list;
}