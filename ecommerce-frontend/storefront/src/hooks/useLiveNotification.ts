"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notification.store";
import toast from "react-hot-toast";

export const useLiveNotification = () => {

  const user = useAuthStore(
    (state) => state.user
  );

  const token = useAuthStore(
    (state) => state.token
  );


  const addNotification =
    useNotificationStore(
      (state) => state.addNotification
    );


  const wsRef =
    useRef<WebSocket | null>(null);


  const retryRef =
    useRef<NodeJS.Timeout | null>(null);



  useEffect(() => {

    if (!user?.id || !token) return;


    let active = true;

    let retryCount = 0;

    const MAX_RETRY = 5;



    const API_URL =
      process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ||
      "http://localhost:3018";



    const WS_URL =
      process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL ||
      "ws://localhost:8080";




    /*
    =========================
    FETCH NOTIFICATIONS
    =========================
    */


    const fetchNotifications = async () => {

      try {


        const res =
          await fetch(
            `${API_URL}/notifications/${user.id}`,
            {
              method:"GET",

              headers:{
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              credentials:"include"
            }
          );



        if(!res.ok){

          console.warn(
            "Notification API failed:",
            res.status
          );

          return;
        }



        const data =
          await res.json();



        console.log(
          "🔔 Notifications:",
          data
        );



        if(Array.isArray(data)){

          data.forEach(
            (n)=>addNotification(n)
          );

        }


      } catch(err){

        console.error(
          "❌ Notification fetch error:",
          err
        );

      }

    };





    /*
    =========================
    WEBSOCKET
    =========================
    */


    const connectWS = () => {


      if(!active) return;



      if(
        wsRef.current &&
        (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        )
      ){
        return;
      }



      const url =
        `${WS_URL}?userId=${user.id}`;



      console.log(
        "🔌 WS:",
        url
      );



      const ws =
        new WebSocket(url);



      wsRef.current = ws;



      ws.onopen = ()=>{

        console.log(
          "✅ WebSocket connected"
        );

        retryCount=0;

      };




      ws.onmessage =
      (event)=>{


        try{


          const data =
            JSON.parse(
              event.data
            );


          const notification = {

            id:
              crypto.randomUUID(),

            type:
              data.type || "INFO",

            message:
              data.message ||
              "Notification",

            createdAt:
              new Date()
              .toISOString()

          };



          addNotification(
            notification
          );


          toast.success(
            notification.message
          );


        }catch(err){

          console.warn(
            "Invalid WS data",
            err
          );

        }

      };




      ws.onerror = (err)=>{

        console.warn(
          "WS error",
          err
        );

      };




      ws.onclose = ()=>{


        wsRef.current=null;



        if(!active) return;



        if(retryCount >= MAX_RETRY)
          return;



        retryCount++;



        retryRef.current =
          setTimeout(
            connectWS,
            3000
          );

      };


    };




    fetchNotifications();

    connectWS();



    return ()=>{


      active=false;


      wsRef.current?.close();


      if(retryRef.current){

        clearTimeout(
          retryRef.current
        );

      }

    };


  },[
    user?.id,
    token,
    addNotification
  ]);

};
