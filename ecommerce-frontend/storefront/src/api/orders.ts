import { apiClient } from "./apiClient";



export const createOrder =
async(
 data:any
)=>{


 const res =
 await apiClient.post(
  "/orders",
  data
 );


 return res.data;

};





export const getOrders =
async()=>{


 const res =
 await apiClient.get(
  "/orders"
 );


 return res.data;

};






export const getOrderById =
async(
 id:string
)=>{


 const res =
 await apiClient.get(
  `/orders/${id}`
 );


 return res.data;

};






export const cancelOrder =
async(
 id:string
)=>{


 const res =
 await apiClient.patch(
  `/orders/${id}/cancel`
 );


 return res.data;

};






export const updateOrderStatus =
async(
 id:string,
 status:string
)=>{


 const res =
 await apiClient.patch(
  `/orders/${id}/status`,
  {
    status
  }
 );


 return res.data;

};
