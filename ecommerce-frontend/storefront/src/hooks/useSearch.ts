"use client";


import {
 useState,
} from "react";


import {
 searchProducts,
} from "@/api/search";




export function useSearch(){



const [loading,setLoading] =
useState(false);



const [results,setResults] =
useState<any[]>([]);







const search =
async(
 query:string
)=>{


try{


setLoading(true);



const data =
await searchProducts(query);




setResults(
 Array.isArray(data)
 ? data
 : data.results || []
);



return data;



}
finally{


setLoading(false);


}



};






return {


 search,

 results,

 loading,


};


}
