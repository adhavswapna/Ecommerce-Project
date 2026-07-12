import {apiClient} from "./apiClient";



export const getInventory =
async(
 productId:string
)=>{


 const res =
 await apiClient.get(
 `/inventory/${productId}`
 );


 return res.data;

};




export const updateStock =
async(
 data:any
)=>{


 const res =
 await apiClient.patch(
 "/inventory",
 data
 );


 return res.data;

};
