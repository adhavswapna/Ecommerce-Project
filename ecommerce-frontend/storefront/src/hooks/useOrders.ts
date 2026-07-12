"use client";


import {
 useCallback,
 useState,
} from "react";


import {
 createOrder,
 getOrderById,
 getOrders,
 cancelOrder,
 updateOrderStatus,
} from "@/api/orders";


import {
 CreateOrderPayload,
 Order,
} from "@/types/order";


import toast from "react-hot-toast";




export const useOrders = () => {



const [orders,setOrders] =
useState<Order[]>([]);



const [order,setOrder] =
useState<Order|null>(null);



const [loading,setLoading] =
useState(false);







const placeOrder =
useCallback(
async(payload:CreateOrderPayload)=>{


try{


 setLoading(true);



 const data =
 await createOrder(payload);



 setOrder(data);



 toast.success(
  "Order placed successfully"
 );



 return data;



}
catch(error:any){


 toast.error(
 error?.response?.data?.message
 ||
 "Failed to place order"
 );


 throw error;


}
finally{


 setLoading(false);


}



},[]);










const fetchOrder =
useCallback(
async(id:string)=>{


try{


 setLoading(true);



 const data =
 await getOrderById(id);



 setOrder(data);



 return data;



}
catch(error:any){


toast.error(
 "Failed to fetch order"
);



throw error;


}
finally{


setLoading(false);


}



},[]);









const fetchOrders =
useCallback(
async()=>{


try{


setLoading(true);



const data =
await getOrders();



setOrders(
 Array.isArray(data)
 ? data
 : data.orders || []
);



return data;



}
catch(error:any){


toast.error(
 "Failed to fetch orders"
);



throw error;


}
finally{


setLoading(false);


}



},[]);









const cancel =
useCallback(
async(id:string)=>{


try{


setLoading(true);



const data =
await cancelOrder(id);



setOrder(data);



return data;



}
catch(error:any){


toast.error(
 "Cancel failed"
);


throw error;


}
finally{


setLoading(false);


}



},[]);









const updateStatus =
useCallback(
async(
 id:string,
 status:string
)=>{


const data =
await updateOrderStatus(
 id,
 status
);



setOrder(data);



return data;



},[]);








return {


 orders,

 order,

 loading,


 placeOrder,

 fetchOrder,

 fetchOrders,

 cancel,

 updateStatus,


};


};
