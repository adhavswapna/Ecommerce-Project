"use client";


import {
  useCallback,
  useState,
} from "react";


import {
  createOrder,
  confirmOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
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
    useState<Order | null>(null);


  const [loading,setLoading] =
    useState(false);



  /**
   * CREATE ORDER
   */
  const placeOrder =
    useCallback(
      async(
        payload:CreateOrderPayload
      )=>{

        try {

          setLoading(true);


          const data =
            await createOrder(
              payload
            );


          setOrder(data);


          toast.success(
            "Order placed successfully"
          );


          return data;


        }catch(error:any){


          toast.error(
            error?.response?.data?.message ||
            "Failed to place order"
          );


          throw error;


        }finally{

          setLoading(false);

        }

      },[]
    );



  /**
   * FETCH ORDER
   */
  const fetchOrder =
    useCallback(
      async(
        id:string
      )=>{

        try{

          setLoading(true);


          const data =
            await getOrderById(id);


          setOrder(data);


          return data;


        }catch(error:any){


          toast.error(
            "Failed to fetch order"
          );


          throw error;


        }finally{

          setLoading(false);

        }


      },[]
    );




  /**
   * FETCH USER ORDERS
   */
  const fetchOrders =
    useCallback(
      async()=>{

        try{

          setLoading(true);


          const data =
            await getMyOrders();


          setOrders(data);


          return data;


        }catch(error:any){


          toast.error(
            "Failed to fetch orders"
          );


          throw error;


        }finally{

          setLoading(false);

        }


      },[]
    );





  /**
   * CONFIRM
   */
  const confirm =
    useCallback(
      async(
        id:string
      )=>{

        try{

          setLoading(true);


          const data =
            await confirmOrder(id);


          setOrder(data);


          return data;


        }finally{

          setLoading(false);

        }

      },[]
    );




  /**
   * CANCEL
   */
  const cancel =
    useCallback(
      async(
        id:string
      )=>{

        try{

          setLoading(true);


          const data =
            await cancelOrder(id);


          setOrder(data);


          return data;


        }finally{

          setLoading(false);

        }


      },[]
    );





  return {

    orders,

    order,

    loading,


    placeOrder,

    fetchOrder,

    fetchOrders,

    confirm,

    cancel,

  };

};
