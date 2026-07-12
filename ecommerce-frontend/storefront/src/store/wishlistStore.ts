"use client";


import { create } from "zustand";

import toast from "react-hot-toast";


import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/api/wishlist";



export interface WishlistItem {

  id:string;

  productId:string;

  price?:number;

  name?:string;

  image?:string;

}




interface WishlistState {


  wishlist:WishlistItem[];

  loading:boolean;

  error:string|null;



  fetchWishlist:
  ()=>Promise<void>;



  addItem:
  (
    productId:string,
    price?:number
  )=>Promise<void>;



  removeItem:
  (
    itemId:string
  )=>Promise<void>;



  clear:
  ()=>void;



  isWishlisted:
  (
    productId:string
  )=>boolean;


}






export const useWishlistStore =
create<WishlistState>((set,get)=>({


wishlist:[],

loading:false,

error:null,






/*
|--------------------------------------------------------------------------
| Fetch
|--------------------------------------------------------------------------
*/


fetchWishlist:
async()=>{


try{


 set({
  loading:true,
  error:null
 });



 const data =
 await getWishlist();



 set({

 wishlist:
 Array.isArray(data)
 ? data
 : data.items || []

 });



}
catch(error:any){


 const message =
 error?.response?.data?.message
 ||
 "Failed to load wishlist";



 set({
  error:message,
  wishlist:[]
 });



 toast.error(message);



}
finally{


 set({
  loading:false
 });


}



},








/*
|--------------------------------------------------------------------------
| Add
|--------------------------------------------------------------------------
*/


addItem:
async(
 productId,
 price=0
)=>{


try{


 const exists =
 get()
 .wishlist
 .some(
 item =>
 item.productId === productId
 );



 if(exists){


 toast(
  "Already in wishlist"
 );


 return;


 }





 await addToWishlist({

  productId,

  price

 });




 await get()
 .fetchWishlist();



 toast.success(
  "Added to wishlist"
 );



}
catch(error:any){


toast.error(

 error?.response?.data?.message
 ||
 "Failed to add wishlist item"

);


}



},








/*
|--------------------------------------------------------------------------
| Remove
|--------------------------------------------------------------------------
*/


removeItem:
async(
 itemId
)=>{


try{


 await removeFromWishlist(
  itemId
 );


 await get()
 .fetchWishlist();



 toast.success(
  "Removed from wishlist"
 );


}
catch(error:any){


toast.error(

 error?.response?.data?.message
 ||
 "Remove failed"

);


}


},








/*
|--------------------------------------------------------------------------
| Clear local
|--------------------------------------------------------------------------
*/


clear:()=>{


 set({
  wishlist:[]
 });


},







/*
|--------------------------------------------------------------------------
| Exists
|--------------------------------------------------------------------------
*/


isWishlisted:
(
 productId
)=>{


 return get()
 .wishlist
 .some(
 item =>
 item.productId === productId
 );


}



}));
