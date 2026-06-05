"use client";


import {
  useSearchParams,
  useRouter,
} from "next/navigation";


import toast from "react-hot-toast";


import {
  createPayment,
} from "@/api/payments";



export default function PaymentsPage(){


const router = useRouter();


const searchParams =
useSearchParams();



const orderId =
searchParams.get("orderId") || "";



const amount =
Number(
 searchParams.get("amount") || 0
);



const handlePayment =
async()=>{


try{


const user =
JSON.parse(
 localStorage.getItem("user") || "{}"
);



if(!user.id){

toast.error(
"User not logged in"
);

return;

}




const paymentData = {


userId:
user.id,


orderId,


amount,


provider:
"razorpay",


currency:
"INR"

};




console.log(
"PAYMENT DATA",
paymentData
);



await createPayment(
 paymentData
);



toast.success(
"Payment successful"
);



router.push(
 `/orders/order-success?id=${orderId}`
);



}catch(error){


console.error(
error
);



toast.error(
"Payment failed"
);



}


};





return (

<main className="max-w-3xl mx-auto py-16">


<div className="bg-white border rounded-2xl p-10">


<h1 className="text-4xl font-bold">
Payment
</h1>



<div className="mt-8">

<p className="text-gray-500">
Order ID
</p>


<p className="font-medium break-all">
{orderId}
</p>


</div>




<div className="mt-6">

<p className="text-gray-500">
Amount
</p>


<h2 className="text-4xl font-bold">
₹{amount}
</h2>


</div>




<button

onClick={handlePayment}

className="mt-10 bg-black text-white px-6 py-3 rounded-xl"

>

Pay Now

</button>



</div>


</main>

);

}
