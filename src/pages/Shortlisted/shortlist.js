

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import loader from "../../assets/loader.webp";

export default function ShortListed() {
  const params = useParams();
  const encryptedId = params.encryptedId;
  const action = params.action;

  const [actionn, setAction] = useState("");
  const[loading,setLoading] = useState(false);

  const CandidateAction = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}candidate/action/${encryptedId}/${action}`);
      console.log("response", response);
      if(response?.status==200){
        setAction(response?.data);

      }
     
    } catch (error) {
      console.log("error", error);
      setAction({ message: error?.response?.data?.error });
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    CandidateAction();
  }, []);

  const renderAction = () => {
    if (typeof actionn === 'string') {
      return actionn;
    } else if (typeof actionn === 'object' && actionn !== null) {
      return actionn.message;
    }
    return null;
  };

  return (
    <>
    {
      loading ?(
        <div className="flex justify-center mt-12 h-screen">
           <img src={loader}  alt="Please Wait....."/>  
          </div>
       
      ):(
        <div className="flex justify-center mt-12 h-screen">
        <span className="text-green-500 text-4xl font-bold">{renderAction()}</span>
      </div>
      )
    }
     
    </>
  );
}
