import { authApi, userApi } from "./apiClient";


/* =====================================================
   👤 GET CURRENT USER (AUTH SERVICE)
===================================================== */
export async function getMe() {

  try {


    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;


    console.log(
      "TOKEN IN getMe:",
      token
    );


    if(!token){

      console.log(
        "NO TOKEN FOUND"
      );

      return null;

    }



    const { data } =
      await authApi.get(
        "/auth/me",
        {
          headers:{

            Authorization:
              `Bearer ${token}`

          }

        }
      );



    console.log(
      "CURRENT USER:",
      data
    );



    // save user for checkout
    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );



    return data;



  } catch(error:any){


    console.error(
      "❌ getMe failed"
    );


    console.error(
      "STATUS:",
      error.response?.status
    );


    console.error(
      "DATA:",
      error.response?.data
    );


    return null;

  }

}





/* =====================================================
   👤 GET USER PROFILE BY ID
===================================================== */

export async function getUserProfile(
 userId:string
){

 try{


  const {data} =
    await userApi.get(
      `/users/${userId}`
    );


  return data;


 }
 catch(error){

  console.error(
    "getUserProfile error",
    error
  );


  return null;

 }

}





/* =====================================================
   ✏ UPDATE USER
===================================================== */

export async function updateUserProfile(

 userId:string,

 payload:{
  name?:string;
  phone?:string;
  address?:string;
 }

){


 try{


  const {data} =
    await userApi.put(
      `/users/${userId}`,
      payload
    );


  return data;


 }
 catch(error){

  console.error(
    "updateUserProfile error",
    error
  );


  return null;

 }

}





/* =====================================================
   📋 ALL USERS
===================================================== */

export async function getAllUsers(){


 try{


  const {data} =
    await userApi.get(
      "/users"
    );


  return data;


 }
 catch(error){

  console.error(
    error
  );


  return [];

 }

}





/* =====================================================
   DELETE USER
===================================================== */

export async function deleteUser(
 userId:string
){

 try{


  const {data} =
    await userApi.delete(
      `/users/${userId}`
    );


  return data;


 }
 catch(error){

  console.error(
    error
  );


  return null;

 }

}
