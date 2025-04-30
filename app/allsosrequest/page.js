"use client";

import { getSOSRequests } from "@/services/sosRequestService";
import { useState, useEffect } from "react";

export default function AllSosRequest() {
  const [sosreqs, setsosreqs] = useState([]);

  useEffect(() => {
    async function fetchSosReq() {
      try {
        const result = await getSOSRequests();
        if (result && result.data) {
          setsosreqs(result.data);
        } else {
          console.error("Failed to fetch SOS requests:", result.message);
        }
      } catch (error) {
        console.error("Error fetching SOS requests:", error);
      }
    }
    fetchSosReq();
  }, []);

  return (
    <div>
      <h1>ALl Global SOS Request</h1>
      {sosreqs.map((sos, index) => (
        <div key={index}>
          <h2>Email: {sos.user}</h2>
          <p>Date: {sos.date}</p>
          <p>Location LAT: {sos.location.lat}</p>
          <p>Location LAT: {sos.location.lat}</p>
          <br></br>
        </div>
      ))}
    </div>
  );
}
