import { authApi, userApi } from "./apiClient";



/* =====================================================
   👤 GET CURRENT USER
   Auth service:
   /auth/me
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


    if (!token) {

      console.log(
        "NO TOKEN FOUND"
      );

      return null;
    }



    const { data } =
      await authApi.get(
        "/me",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    console.log(
      "CURRENT USER:",
      data
    );



    if (typeof window !== "undefined") {

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

    }


    return data;


  } catch (error:any) {


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
   👤 GET USER PROFILE
   User service:
   /users/:id
===================================================== */

export async function getUserProfile(
  userId:string
) {

  try {


    const { data } =
      await userApi.get(
        `/${userId}`
      );


    return data;


  } catch(error) {


    console.error(
      "getUserProfile error",
      error
    );


    return null;

  }

}





/* =====================================================
   ✏ UPDATE USER
   /users/:id
===================================================== */

export async function updateUserProfile(

  userId:string,

  payload:{
    name?:string;
    phone?:string;
    address?:string;
  }

) {


  try {


    const { data } =
      await userApi.put(
        `/${userId}`,
        payload
      );


    return data;


  } catch(error) {


    console.error(
      "updateUserProfile error",
      error
    );


    return null;

  }

}





/* =====================================================
   📋 GET ALL USERS
   /users
===================================================== */

export async function getAllUsers() {

  try {


    const { data } =
      await userApi.get(
        "/"
      );


    return data;


  } catch(error) {


    console.error(
      "getAllUsers error",
      error
    );


    return [];

  }

}





/* =====================================================
   🗑 DELETE USER
   /users/:id
===================================================== */

export async function deleteUser(
  userId:string
) {

  try {


    const { data } =
      await userApi.delete(
        `/${userId}`
      );


    return data;


  } catch(error) {


    console.error(
      "deleteUser error",
      error
    );


    return null;

  }

}
