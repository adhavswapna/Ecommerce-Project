import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";



const attachToken = (
  instance: AxiosInstance
): AxiosInstance => {


  instance.interceptors.request.use(

    (
      config: InternalAxiosRequestConfig
    ) => {


      if(
        typeof window !== "undefined"
      ){

        const token =
          localStorage.getItem("token");


        console.log(
          "TOKEN SENT:",
          token ? "YES" : "NO"
        );


        if(token){

          config.headers =
            config.headers || {};


          config.headers.Authorization =
            `Bearer ${token}`;

        }

      }



      console.log(
        "🚀 API REQUEST:",
        `${config.baseURL}${config.url}`
      );


      return config;

    },

    error =>
      Promise.reject(error)

  );




  instance.interceptors.response.use(

    response =>
      response,


    error => {


      console.error(
        "❌ API ERROR:",
        error.message,
        error.response?.status,
        error.response?.data
      );



      if(
        error.response?.status === 401
      ){

        if(
          typeof window !== "undefined"
        ){

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          window.location.href =
            "/login";

        }

      }


      return Promise.reject(error);

    }

  );



  return instance;

};






const createApi = (
  url:string
)=>{


  return attachToken(

    axios.create({

      baseURL:url,

      timeout:30000,

      headers:{

        "Content-Type":
          "application/json"

      }

    })

  );

};







export const authApi =
createApi(
 process.env.NEXT_PUBLIC_AUTH_API_URL ||
 "http://127.0.0.1:3001"
);



export const userApi =
createApi(
 process.env.NEXT_PUBLIC_USER_API_URL ||
 "http://127.0.0.1:3015"
);



export const productApi =
createApi(
 process.env.NEXT_PUBLIC_PRODUCT_API_URL ||
 "http://127.0.0.1:3003"
);



export const cartApi =
createApi(
 process.env.NEXT_PUBLIC_CART_API_URL ||
 "http://127.0.0.1:3005"
);



export const orderApi =
createApi(
 process.env.NEXT_PUBLIC_ORDER_API_URL ||
 "http://127.0.0.1:3006"
);




export const paymentApi =
createApi(
 process.env.NEXT_PUBLIC_PAYMENT_API_URL ||
 "http://127.0.0.1:3007"
);




export const vendorApi =
createApi(
 process.env.NEXT_PUBLIC_VENDOR_API_URL ||
 "http://127.0.0.1:3012"
);




export const searchApi =
createApi(
 process.env.NEXT_PUBLIC_SEARCH_API_URL ||
 "http://127.0.0.1:3013"
);




export const shippingApi =
createApi(
 process.env.NEXT_PUBLIC_SHIPPING_API_URL ||
 "http://127.0.0.1:3014"
);




export const ratingApi =
createApi(
 process.env.NEXT_PUBLIC_RATING_API_URL ||
 "http://127.0.0.1:3008"
);




export const analyticsApi =
createApi(
 process.env.NEXT_PUBLIC_ANALYTICS_API_URL ||
 "http://127.0.0.1:3011"
);






/*
===========================
INVOICE SERVICE
===========================
*/


export const invoiceApi =
createApi(

 process.env.NEXT_PUBLIC_INVOICE_API_URL ||

 "http://127.0.0.1:3010"

);



invoiceApi.interceptors.request.use(

(config)=>{


 console.log(
   "📄 INVOICE REQUEST:",
   `${config.baseURL}${config.url}`
 );


 return config;

}

);





invoiceApi.interceptors.response.use(

(response)=>{


 console.log(
   "📄 INVOICE RESPONSE:",
   response.status
 );


 return response;

},


(error)=>{


 console.error(

   "📄 INVOICE RESPONSE ERROR:",

   error.message,

   error.response?.status,

   error.response?.data

 );


 return Promise.reject(error);

}

);







export const refundApi =
createApi(
 process.env.NEXT_PUBLIC_REFUND_API_URL ||
 "http://127.0.0.1:3016"
);





export const notificationApi =
createApi(
 process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ||
 "http://127.0.0.1:3018"
);







const apiClient = {


 authApi,

 userApi,

 productApi,

 cartApi,

 orderApi,

 paymentApi,

 vendorApi,

 searchApi,

 shippingApi,

 ratingApi,

 analyticsApi,

 invoiceApi,

 refundApi,

 notificationApi


};



export default apiClient;
