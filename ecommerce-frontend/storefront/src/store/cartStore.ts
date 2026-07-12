"use client";


import { create } from "zustand";

import toast from "react-hot-toast";


import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/api/cart";



/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/


export interface CartItem {

  id:string;

  productId:string;

  name?:string;

  image?:string;

  price:number;

  quantity:number;

}



interface Address {

  addressLine1:string;

  city:string;

  state:string;

  pincode:string;

  phone:string;

}




interface CartState {


  items:CartItem[];

  loading:boolean;

  error:string|null;



  address:Address;



  setAddress:
  (
    address:Address
  )=>void;



  fetchCart:
  ()=>Promise<void>;



  addItem:
  (
    productId:string,
    quantity?:number,
    price?:number
  )=>Promise<void>;



  updateItem:
  (
    itemId:string,
    quantity:number
  )=>Promise<void>;



  removeItem:
  (
    itemId:string
  )=>Promise<void>;



  clear:
  ()=>Promise<void>;



  cartTotal:
  ()=>number;



  cartCount:
  ()=>number;

}






export const useCartStore =
create<CartState>((set,get)=>
({



items:[],

loading:false,

error:null,



address:{

 addressLine1:"",

 city:"",

 state:"",

 pincode:"",

 phone:"",

},





/*
|--------------------------------------------------------------------------
| Address
|--------------------------------------------------------------------------
*/


setAddress:(address)=>
 set({
  address
 }),







/*
|--------------------------------------------------------------------------
| Fetch Cart
|--------------------------------------------------------------------------
*/


fetchCart:async()=>{


 try{


  set({
   loading:true,
   error:null
  });



  const data =
    await getCart();



  set({

    items:
      Array.isArray(data)
      ? data
      : data.items || []

  });



 }
 catch(error:any){



  const message =
    error?.response?.data?.message
    ||
    "Failed to load cart";



  set({
    error:message
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
| Add item
|--------------------------------------------------------------------------
*/


addItem:
async(
 productId,
 quantity=1,
 price=0
)=>{


 try{


  await addToCart({

    productId,

    quantity,

    price

  });



  await get()
    .fetchCart();



  toast.success(
    "Added to cart"
  );



 }
 catch(error:any){


 toast.error(
 error?.response?.data?.message
 ||
 "Failed to add item"
 );


 }



},







/*
|--------------------------------------------------------------------------
| Update item
|--------------------------------------------------------------------------
*/


updateItem:
async(
 itemId,
 quantity
)=>{


 try{


  if(quantity<=0){

    await get()
    .removeItem(itemId);

    return;

  }




  await updateCartItem(

    itemId,

    {
      quantity
    }

  );



  await get()
  .fetchCart();



  toast.success(
   "Cart updated"
  );



 }
 catch(error:any){


 toast.error(
  error?.response?.data?.message
  ||
  "Update failed"
 );


 }



},







/*
|--------------------------------------------------------------------------
| Remove item
|--------------------------------------------------------------------------
*/


removeItem:
async(
 itemId
)=>{


 try{


  await removeCartItem(
    itemId
  );



  await get()
  .fetchCart();



  toast.success(
    "Removed from cart"
  );


 }
 catch(error:any){


 toast.error(
  "Remove failed"
 );


 }



},







/*
|--------------------------------------------------------------------------
| Clear cart
|--------------------------------------------------------------------------
*/


clear:
async()=>{


 try{


  await clearCart();



  set({
    items:[]
  });



  toast.success(
    "Cart cleared"
  );


 }
 catch(error:any){


 toast.error(
  "Clear failed"
 );


 }



},







/*
|--------------------------------------------------------------------------
| Total
|--------------------------------------------------------------------------
*/


cartTotal:()=>{


 return get()
 .items
 .reduce(

  (
   total,
   item
  )=>

  total +
  Number(item.price) *
  item.quantity,

  0

 );


},








/*
|--------------------------------------------------------------------------
| Count
|--------------------------------------------------------------------------
*/


cartCount:()=>{


 return get()
 .items
 .reduce(

  (
   total,
   item
  )=>

  total +
  item.quantity,

  0

 );


}



}));
