import {apiClient} from "./apiClient";



export const getNotifications =
async()=>{


 const res =
 await apiClient.get(
 "/notifications"
 );


 return res.data;

};




export const markNotificationRead =
async(
 id:string
)=>{


 const res =
 await apiClient.patch(
 `/notifications/${id}/read`
 );


 return res.data;

};
