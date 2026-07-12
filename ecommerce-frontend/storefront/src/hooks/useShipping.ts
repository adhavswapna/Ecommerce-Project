"use client";


import {
 useState,
} from "react";


import {
 createShipment,
 getShipment,
 CreateShipmentPayload,
} from "@/api/shipping";





export function useShipping(){



const [loading,setLoading] =
useState(false);




const create =
async(
 payload:CreateShipmentPayload
)=>{


try{


setLoading(true);


return await createShipment(payload);



}
finally{


setLoading(false);


}


};





const get =
async(
 orderId:string
)=>{


return await getShipment(orderId);


};





return {


 create,

 get,

 loading,


};


}
