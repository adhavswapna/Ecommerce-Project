"use client";


import {create} from "zustand";

import type {
 User,
 JwtUserPayload
} from "@/types/user";

import {
 decodeJwtUser
} from "@/types/user";



interface AuthState {


 token:string|null;

 user:User|null;

 jwtUser:JwtUserPayload|null;


 isAuthenticated:boolean;

 hydrated:boolean;



 setAuth:
 (
  token:string,
  user:User
 )=>void;



 logout:
 ()=>void;



 hydrate:
 ()=>void;

}



const TOKEN_KEY="token";

const USER_KEY="user";




const getStoredToken=()=>{


 if(
  typeof window==="undefined"
 )
 return null;



 const token =
 localStorage.getItem(
  TOKEN_KEY
 );



 if(
 !token ||
 token==="null" ||
 token==="undefined"
 )
 return null;




 try{


  const payload =
   JSON.parse(
    atob(
     token.split(".")[1]
    )
   );



  if(
   payload.exp &&
   payload.exp*1000 <
   Date.now()
  ){

    localStorage.removeItem(
     TOKEN_KEY
    );

    localStorage.removeItem(
     USER_KEY
    );


    return null;
  }



  return token;



 }catch{


 return null;


 }

};





const getStoredUser=()=>{


 if(
 typeof window==="undefined"
 )
 return null;



 try{


 const user =
 localStorage.getItem(
  USER_KEY
 );



 if(!user)
 return null;



 return JSON.parse(user);



 }catch{


 return null;


 }

};






export const useAuthStore =
create<AuthState>((set)=>(

{


 token:null,

 user:null,

 jwtUser:null,


 isAuthenticated:false,

 hydrated:false,





 hydrate:()=>{


 const token =
 getStoredToken();


 const user =
 getStoredUser();



 set({

 token,

 user,

 jwtUser:
 decodeJwtUser(token),


 isAuthenticated:
 !!token,


 hydrated:true

 });


 },







 setAuth:
 (
 token,
 user
 )=>{


 if(
 typeof window!=="undefined"
 ){


 localStorage.setItem(
  TOKEN_KEY,
  token
 );


 localStorage.setItem(
  USER_KEY,
  JSON.stringify(user)
 );


 }



 set({

 token,

 user,


 jwtUser:
 decodeJwtUser(token),


 isAuthenticated:true,


 hydrated:true

 });


 },








 logout:()=>{


 if(
 typeof window!=="undefined"
 ){


 localStorage.removeItem(
  TOKEN_KEY
 );


 localStorage.removeItem(
  USER_KEY
 );


 }




 set({

 token:null,

 user:null,

 jwtUser:null,


 isAuthenticated:false,


 hydrated:true

 });


 }



}

));
