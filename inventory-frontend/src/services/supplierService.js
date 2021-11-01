import axios from "axios";
import React, {useEffect, useState} from 'react';

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
    // axios.post('http://localhost:8080/api/v1/supplier', data)
    // .then(response => {
    //   console.log("Status: ", response.status);
    //   console.log("Message: ", response);
    // }).catch(error => {
    //   console.error('Something went wrong!', error);
    // });
}
// export function insertSupplier(data){
//     console.log('data', data)
//     let suppliers = getAllSuppliers();
//     data['id'] = generateSupplierId();
//     suppliers.push(data);
//     localStorage.setItem(KEYS.suppliers, JSON.stringify(suppliers))
// }

export function updateSupplier(data){
    // axios.put('http://localhost:8080/api/v1/supplier/'+ data.id, data)
    // .then(response => {
    //   console.log("Status: ", response.status);
    //   console.log("Message: ", response);
    // }).catch(error => {
    //   console.error('Something went wrong!', error);
    // });
}

export function deleteSupplier(id){
    axios.delete('http://localhost:8080/api/v1/supplier/'+ id)
    .then(response => {
      console.log("Status: ", response.status);
      console.log("Message: ", response);
    }).catch(error => {
      console.error('Something went wrong!', error);
    });
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

export async function getAllSuppliersAPI(setRecords){
    // await axios.get('http://localhost:8080/api/v1/supplier/all')
    //     .then((function (response){
    //         console.log("response.data.data", response.data.data)
    //         setRecords(response.data.data)
    //         // return list;
    //     }))
}
