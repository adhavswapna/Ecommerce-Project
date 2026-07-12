"use client";


import {
 useEffect,
} from "react";


import {
 useWishlistStore,
} from "@/store/wishlistStore";



export const useWishlist = () => {



const wishlist =
useWishlistStore(
 s=>s.wishlist
);



const loading =
useWishlistStore(
 s=>s.loading
);



const fetchWishlist =
useWishlistStore(
 s=>s.fetchWishlist
);



const addItem =
useWishlistStore(
 s=>s.addItem
);



const removeItem =
useWishlistStore(
 s=>s.removeItem
);



const clear =
useWishlistStore(
 s=>s.clear
);



const isWishlisted =
useWishlistStore(
 s=>s.isWishlisted
);





useEffect(()=>{


 fetchWishlist();


},[fetchWishlist]);





return {

 wishlist,

 loading,

 fetchWishlist,

 addItem,

 removeItem,

 clear,

 isWishlisted,

};


};
