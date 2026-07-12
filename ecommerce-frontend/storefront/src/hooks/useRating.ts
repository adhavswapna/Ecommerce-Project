import {
 createRating,
 CreateRatingPayload
}
from "@/api/rating";


export function useRating(){

 const addRating =
 async(payload:CreateRatingPayload)=>{

   return await createRating(payload);

 };


 return {
   addRating
 };

}
