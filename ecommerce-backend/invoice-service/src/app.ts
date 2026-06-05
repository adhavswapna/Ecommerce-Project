import express from "express";
import cors from "cors";

import invoiceRoutes from "./routes/invoice.routes";


const app = express();



app.use(

  cors({

    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],

    credentials:true,

    methods:[
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders:[
      "Content-Type",
      "Authorization"
    ]

  })

);



app.use(
  express.json()
);



app.get(
  "/",
  (req,res)=>{

    res.json({
      service:"invoice-service",
      status:"running"
    });

  }
);




app.use(
  "/invoices",
  invoiceRoutes
);



export default app;
