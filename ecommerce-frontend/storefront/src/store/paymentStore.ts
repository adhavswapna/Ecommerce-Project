"use client";


import { create } from "zustand";

import toast from "react-hot-toast";


import {
 createPayment,
 verifyPayment,
} from "@/api/payments";


import {
 Payment,
 CreatePaymentPayload,
} from "@/types/payment";





interface PaymentState {


 payment:Payment|null;


 loading:boolean;



 create:
 (
 payload:CreatePaymentPayload
 )=>Promise<Payment|null>;



 verify:
 (
 paymentId:string
 )=>Promise<boolean>;

}





export const usePaymentStore =
create<PaymentState>((set)=>({



payment:null,


loading:false,






create:
async(payload)=>{


 try{


 set({
  loading:true
 });



 const payment =
 await createPayment(
  payload
 );



 set({
  payment
 });



 toast.success(
  "Payment created"
 );



 return payment;



 }
 catch(error:any){


 toast.error(
  error?.response?.data?.message
  ||
  "Payment failed"
 );


 return null;



 }
 finally{


 set({
  loading:false
 });


 }



},







verify:
async(paymentId)=>{


 try{


 set({
  loading:true
 });



 await verifyPayment(
  paymentId
 );



 toast.success(
  "Payment verified"
 );



 return true;



 }
 catch(error:any){


 toast.error(
  error?.response?.data?.message
  ||
  "Payment verification failed"
 );


 return false;



 }
 finally{


 set({
  loading:false
 });


 }



}



}));
