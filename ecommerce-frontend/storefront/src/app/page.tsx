"use client";


import Link from "next/link";


import {
  useEffect,
  useState
} from "react";


import {
  useRouter
} from "next/navigation";


import {
  useAuthStore
} from "@/store/auth.store";


import {
  getMe
} from "@/api/user";




export default function HomePage(){



  const router =
    useRouter();



  const token =
    useAuthStore(
      s=>s.token
    );


  const logout =
    useAuthStore(
      s=>s.logout
    );




  const [
    user,
    setUser
  ] =
  useState<any>(null);




  const [
    loading,
    setLoading
  ] =
  useState(true);







  useEffect(()=>{


    if(!token){

      router.push("/login");

      return;

    }



    getMe()

    .then(
      data =>
      setUser(data)
    )

    .catch(()=>{


      logout();

      router.push(
        "/login"
      );


    })

    .finally(()=>{

      setLoading(false);

    });


  },[token]);









  if(loading){

    return (

      <div
      className="
      p-10
      text-center
      "
      >

        Loading...

      </div>

    );

  }






  return (



<main
className="
bg-gray-100
min-h-screen
"
>







{/* HERO */}



<section

className="
bg-gradient-to-r
from-blue-900
to-blue-600
text-white
px-8
py-20
"

>



<div
className="
max-w-7xl
mx-auto
"
>



<h1

className="
text-5xl
font-bold
"

>

Welcome
{
user?.name
?
`, ${user.name}`
:
""
}

</h1>




<p
className="
mt-5
text-xl
"
>

Discover amazing products at the best prices

</p>






<Link

href="/products"

className="
inline-block
mt-8
bg-yellow-400
text-black
px-10
py-4
rounded-full
font-bold
"

>

Start Shopping

</Link>




</div>



</section>










{/* CATEGORY CARDS */}





<section

className="
max-w-7xl
mx-auto
p-8
grid
md:grid-cols-4
gap-6
"

>






{
[
"Electronics",
"Fashion",
"Home",
"Beauty"
]

.map(
item=>(



<div

key={item}

className="
bg-white
rounded-2xl
shadow
p-8
hover:scale-105
transition
cursor-pointer
"

>


<h2

className="
text-2xl
font-bold
"

>

{item}

</h2>



<p

className="
text-gray-500
mt-3
"

>

Explore now

</p>



</div>


))

}




</section>









{/* DEALS */}




<section

className="
max-w-7xl
mx-auto
px-8
pb-10
"

>



<div

className="
bg-white
rounded-2xl
p-8
shadow
"

>



<h2

className="
text-3xl
font-bold
"

>

Today's Deals 🔥

</h2>




<div

className="
grid
md:grid-cols-3
gap-5
mt-6
"

>



<div
className="
border
rounded-xl
p-6
"
>

<h3 className="font-bold">

Up to 50% OFF

</h3>

<p>

Electronics deals

</p>

</div>





<div
className="
border
rounded-xl
p-6
"
>

<h3 className="font-bold">

Free Delivery

</h3>

<p>

On selected items

</p>

</div>





<div
className="
border
rounded-xl
p-6
"
>

<h3 className="font-bold">

Easy Returns

</h3>

<p>

Hassle free shopping

</p>

</div>






</div>



</div>



</section>










{/* USER CARD */}




<section

className="
max-w-7xl
mx-auto
px-8
pb-10
"

>



<div

className="
bg-white
rounded-2xl
p-6
shadow
"

>


<h2

className="
font-bold
text-xl
"

>

Your Account

</h2>



<p
className="
text-gray-600
mt-2
"
>

Email:
{
user?.email
}

</p>


<p
className="
text-gray-600
"
>

Role:
{
user?.role
}

</p>




<button


onClick={()=>{


logout();


router.push(
"/login"
);


}}


className="
mt-5
bg-red-500
text-white
px-6
py-2
rounded-full
"

>

Logout

</button>



</div>




</section>







</main>



  );

}
