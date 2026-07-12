import {
 apiClient,
} from "./apiClient";




export interface RefundPayload {

 orderId:string;

 reason:string;

}






/*
=====================================================
GET REFUNDS
=====================================================
*/


export const getRefunds =
async()=>{


 const {data} =
 await apiClient.get(
  "/refunds"
 );


 return data;

};







/*
=====================================================
CREATE REFUND
=====================================================
*/


export const createRefund =
async(
 payload:RefundPayload
)=>{


 const {data} =
 await apiClient.post(
  "/refunds",
  payload
 );


 return data;

};







/*
=====================================================
GET REFUND
=====================================================
*/


export const getRefund =
async(
 id:string
)=>{


 const {data} =
 await apiClient.get(
  `/refunds/${id}`
 );


 return data;

};







/*
=====================================================
UPDATE REFUND
=====================================================
*/


export const updateRefund =
async(
 id:string,
 status:string
)=>{


 const {data} =
 await apiClient.patch(
  `/refunds/${id}`,
  {
    status,
  }
 );


 return data;

};
