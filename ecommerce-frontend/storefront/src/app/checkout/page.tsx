"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";

import {
  CreateOrderPayload,
} from "@/types/order";

import toast from "react-hot-toast";


export default function CheckoutPage() {

  const router = useRouter();


  const {
    cartItems,
    total,
    loading: cartLoading,
    fetchCart,
    clear,
  } = useCart();


  const {
    placeOrder,
    loading,
  } = useOrders();



  const [cartLoaded,setCartLoaded] =
    useState(false);


  const [paymentMethod,setPaymentMethod] =
    useState("COD");



  const [form,setForm] =
    useState({

      addressLine1:"",
      addressLine2:"",
      city:"",
      state:"",
      country:"India",
      pincode:"",
      phone:"",

    });



  useEffect(()=>{

    const load = async()=>{

      await fetchCart();

      setCartLoaded(true);

    };

    load();

  },[fetchCart]);




  useEffect(()=>{

    if(
      cartLoaded &&
      !cartLoading &&
      cartItems.length === 0
    ){

      router.push("/cart");

    }

  },[
    cartLoaded,
    cartLoading,
    cartItems,
    router
  ]);




  const totalItems =
    useMemo(()=>{

      return cartItems.reduce(
        (sum,item)=>
          sum + item.quantity,
        0
      );

    },[cartItems]);





  const handleChange =
  (
    e:React.ChangeEvent<HTMLInputElement>
  )=>{

    setForm(prev=>({

      ...prev,

      [e.target.name]:
        e.target.value

    }));

  };





  // get user from localStorage
  const getUser = ()=>{

    try{

      const user =
        localStorage.getItem("user");


      if(user){

        return JSON.parse(user);

      }



      const token =
        localStorage.getItem("token");



      if(token){

        const payload =
          JSON.parse(
            atob(
              token.split(".")[1]
            )
          );


        return payload;

      }


    }
    catch(error){

      console.log(
        "USER READ ERROR",
        error
      );

    }


    return null;

  };






  const handlePlaceOrder =
  async()=>{


    try{


      if(
        !form.addressLine1 ||
        !form.city ||
        !form.state ||
        !form.country ||
        !form.pincode ||
        !form.phone
      ){

        toast.error(
          "Please fill all required fields"
        );

        return;

      }




      if(cartItems.length===0){

        toast.error(
          "Cart is empty"
        );

        return;

      }




      const user =
        getUser();



      console.log(
        "CHECKOUT USER",
        user
      );




      if(!user?.id){


        toast.error(
          "User not found. Login again"
        );


        localStorage.removeItem(
          "token"
        );


        router.push("/login");


        return;

      }





      const payload:
        CreateOrderPayload =
      {


        userId:
          user.id,



        totalAmount:
          Number(total),



        currency:
          "INR",



        paymentMethod,



        address:{


          addressLine1:
            form.addressLine1,


          addressLine2:
            form.addressLine2 || "",


          city:
            form.city,


          state:
            form.state,


          country:
            form.country,


          pincode:
            form.pincode,


          phone:
            form.phone,


        },



        items:

          cartItems.map(item=>({

            productId:
              item.productId,


            quantity:
              Number(item.quantity),


            price:
              Number(item.price),

          }))

      };





      console.log(
        "ORDER PAYLOAD",
        payload
      );





      const order =
        await placeOrder(
          payload
        );




      await clear();




      toast.success(
        "Order placed successfully"
      );




      if(paymentMethod==="ONLINE"){


        router.push(
          `/payments?orderId=${order.id}&amount=${order.totalAmount}`
        );


        return;

      }





      router.push(
        `/orders/${order.id}`
      );


    }
    catch(error:any){


      console.error(
        "ORDER ERROR",
        error
      );


      toast.error(
        error?.response?.data?.message ||
        "Order failed"
      );

    }

  };






  if(
    cartLoading ||
    !cartLoaded
  ){

    return (

      <div className="
      flex justify-center items-center
      min-h-[400px]
      ">

        Loading cart...

      </div>

    );

  }







  return (

    <main className="py-10">


      <h1 className="text-4xl font-bold">
        Checkout
      </h1>


      <p className="text-gray-500 mt-2">
        Complete your order
      </p>





      <div className="
      grid lg:grid-cols-3 gap-8 mt-10
      ">



        <div className="
        lg:col-span-2
        bg-white border rounded-2xl
        p-8
        ">



          <h2 className="text-2xl font-semibold">
            Shipping Address
          </h2>




          <div className="
          grid md:grid-cols-2 gap-4 mt-6
          ">



          {
          Object.keys(form).map((key)=>(

            <input

            key={key}

            name={key}

            placeholder={key}

            value={
              form[key as keyof typeof form]
            }

            onChange={handleChange}

            className="
            border rounded-xl
            px-4 py-3
            "

            />

          ))
          }


          </div>





          <h2 className="text-xl mt-8 font-semibold">
            Payment
          </h2>




          <label className="block mt-4">

          <input

          type="radio"

          checked={
            paymentMethod==="COD"
          }

          onChange={()=>
            setPaymentMethod("COD")
          }

          />

          {" "}Cash On Delivery

          </label>





          <label className="block mt-3">

          <input

          type="radio"

          checked={
            paymentMethod==="ONLINE"
          }

          onChange={()=>
            setPaymentMethod("ONLINE")
          }

          />

          {" "}Online Payment

          </label>



        </div>






        <div className="
        bg-white border rounded-2xl
        p-6
        ">


          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>



          <p className="mt-5">
            Items : {totalItems}
          </p>



          <p className="mt-3 font-bold">
            Total : ₹{total}
          </p>





          <button

          onClick={handlePlaceOrder}

          disabled={loading}

          className="
          mt-8 w-full
          bg-black text-white
          py-3 rounded-xl
          "

          >

          {
          loading
          ?
          "Placing Order..."
          :
          "Place Order"
          }

          </button>


        </div>



      </div>


    </main>

  );

}
