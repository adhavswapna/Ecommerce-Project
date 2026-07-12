import {apiClient} from "./apiClient";


export const gatewayHealth =
async()=>{

return (
 await apiClient.get(
 "/health"
 )
).data;

};
