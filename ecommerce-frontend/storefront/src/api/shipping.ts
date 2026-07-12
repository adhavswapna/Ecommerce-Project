import {
  apiClient,
} from "./apiClient";





export interface CreateShipmentPayload {

 orderId:string;

 userId:string;

 address:string;

 trackingId?:string;

}






/*
=====================================================
CREATE SHIPMENT
=====================================================
*/


export const createShipment =
async(
 payload:CreateShipmentPayload
)=>{


 const {data} =
 await apiClient.post(
  "/shipping",
  payload
 );


 return data;

};







/*
=====================================================
GET SHIPMENT
=====================================================
*/


export const getShipment =
async(
 orderId:string
)=>{


 const {data} =
 await apiClient.get(
  `/shipping/${orderId}`
 );


 return data;

};








/*
=====================================================
UPDATE SHIPMENT
=====================================================
*/


export const updateShipment =
async(
 id:string,
 payload:any
)=>{


 const {data} =
 await apiClient.patch(
  `/shipping/${id}`,
  payload
 );


 return data;

};







/*
=====================================================
TRACK SHIPMENT
=====================================================
*/


export const trackShipment =
async(
 trackingId:string
)=>{


 const {data} =
 await apiClient.get(
  `/shipping/track/${trackingId}`
 );


 return data;

};
