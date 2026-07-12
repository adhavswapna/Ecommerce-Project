
import {
 trackEvent,
 AnalyticsPayload
}
from "@/api/analytics";


export function useAnalytics(){

 const track =
 async(payload:AnalyticsPayload)=>{

 return await trackEvent(payload);

 };


 return {
   track
 };

}
