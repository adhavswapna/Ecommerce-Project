"use client";


import {
 Swiper,
 SwiperSlide
} from "swiper/react";


import {
 Navigation,
 Pagination,
 Thumbs
} from "swiper/modules";


import {
 useState
} from "react";


import Image from "next/image";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";




interface Props {

 images:{
   url:string;
 }[];

 name:string;

}




export default function ProductImageSlider({

 images,

 name

}:Props){



 const [
 thumbsSwiper,
 setThumbsSwiper
 ] = useState<any>(null);




 const validImages =
 images?.filter(
  img=>img?.url
 ) || [];





 if(!validImages.length){

 return (

 <div
 className="
 h-[500px]
 bg-gray-100
 flex
 items-center
 justify-center
 "
 >

 No Image Available

 </div>

 );

 }





 return (

 <div
 className="
 grid
 md:grid-cols-[90px_1fr]
 gap-4
 "
 >




 <div className="hidden md:block">


 <Swiper

 onSwiper={setThumbsSwiper}

 direction="vertical"

 slidesPerView={5}

 spaceBetween={15}

 modules={[Thumbs]}

 className="h-[520px]"

 >



 {
 validImages.map((img,index)=>(


 <SwiperSlide key={index}>


 <div
 className="
 relative
 h-20
 rounded-xl
 overflow-hidden
 border
 "
 >


 <Image

 src={img.url}

 alt="thumbnail"

 fill

 unoptimized

 className="
 object-cover
 "

 />


 </div>



 </SwiperSlide>


 ))

 }


 </Swiper>


 </div>






 <div
 className="
 bg-white
 rounded-2xl
 overflow-hidden
 shadow
 "
 >



 <Swiper


 modules={[
 Navigation,
 Pagination,
 Thumbs
 ]}


 navigation


 pagination={{
 clickable:true
 }}


 thumbs={{
 swiper:thumbsSwiper
 }}


 className="h-[520px]"

 >




 {
 validImages.map((img,index)=>(


 <SwiperSlide key={index}>


 <div
 className="
 relative
 h-[520px]
 flex
 items-center
 justify-center
 p-10
 "
 >



 <Image

 src={img.url}

 alt={`${name}-${index}`}

 fill

 unoptimized

 className="
 object-contain
 "

 onError={(e)=>{

 e.currentTarget.src="/placeholder.png"

 }}

 />


 </div>



 </SwiperSlide>



 ))

 }




 </Swiper>




 </div>





 </div>


 );


}
