import apiClient from "./apiClient";

export interface CreateRatingPayload {
  productId: string;
  rating: number;
  review?: string;
}


export const createRating = async (
  payload: CreateRatingPayload
) => {
  const res = await apiClient.post(
    "/ratings",
    payload
  );

  return res.data;
};


export const getProductRatings = async (
  productId:string
) => {

 const res = await apiClient.get(
   `/ratings/${productId}`
 );

 return res.data;

};
