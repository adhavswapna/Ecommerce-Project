"use client";

import { useState } from "react";

import { createInvoice } from "@/api/invoice.api";

import { Invoice } from "@/types/invoice";


export function useInvoice() {


  const [loading,setLoading] =
    useState(false);



  const [invoice,setInvoice] =
    useState<Invoice | null>(
      null
    );




  const generateInvoice =
    async(
      payload:{
        orderId:string;
        amount:number;
      }
    )=>{


      try {


        setLoading(true);



        const response =
          await createInvoice(
            payload
          );



        if(response){


          setInvoice(
            response
          );


          return response;

        }



        return null;



      }catch(error){


        console.error(
          "❌ GENERATE INVOICE ERROR",
          error
        );


        throw error;



      }finally{


        setLoading(false);

      }

    };





  return {

    loading,

    invoice,

    generateInvoice,

  };

}
