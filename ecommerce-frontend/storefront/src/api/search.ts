import {
  apiClient,
} from "./apiClient";



export interface SearchQuery {

  query:string;

}



/*
=====================================================
SEARCH PRODUCTS
=====================================================
*/


export const searchProducts =
async(
  query:string
)=>{


  const {data} =
    await apiClient.post(
      "/search",
      {
        query,
      }
    );


  return data;

};





/*
=====================================================
ADVANCED SEARCH
=====================================================
*/


export const searchProductsWithFilters =
async(
 payload:any
)=>{


 const {data} =
 await apiClient.post(
  "/search",
  payload
 );


 return data;

};
