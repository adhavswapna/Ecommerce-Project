import {
 apiClient,
} from "./apiClient";



export interface AnalyticsPayload {


 event:string;


 data?:any;


}





/*
=====================================================
TRACK EVENT
=====================================================
*/


export const trackEvent =
async(
 payload:AnalyticsPayload
)=>{


 const res =
 await apiClient.post(
  "/analytics",
  payload
 );


 return res.data;

};







/*
=====================================================
GET ANALYTICS
=====================================================
*/


export const getAnalytics =
async()=>{


 const res =
 await apiClient.get(
  "/analytics"
 );


 return res.data;

};
EOF
