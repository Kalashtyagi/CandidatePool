import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BackButton from "../../../components/BackButton";

const AddTitle = () => {
  const [newTitle, setNewTitle] = useState("");
  const[loading,setLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation()
  // console.log("location data",location)
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const accessToken = jsonData.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const saveTitle =await fetch(`${baseUrl}project-titles`, {
        method: "post",
        headers: {
          'Authorization': `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          title: `${newTitle}`,
        }),
      });
      const response = await saveTitle.json()
      console.log('response',response)
      if(response?.code===201){
        toast.success(`${response?.message}`)
        setTimeout(()=>{
          navigate("/admin/projectTitle");
        },4000)
        clearTimeout()
      }
      else{
        toast.error(`${response?.message}`)
      }
    } catch (error) {
    console.error('error', error)
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    document.title = "CIPLCRM | Add Title"
    if(jsonData?.data?.userPermissions.find(a=>a === "add_category")){
      return
    }else{
      navigate('/admin')
    }
  },[location])

  return (
    <div className="border rounded p-4 mx-4 my-2 bg-white">
       <ToastContainer autoClose={3000} position="top-right"/>
       
      <BackButton route="/admin/projectTitle"/>
      <h1 className="text-2xl text-left ">Create New Project Title</h1>
      
           
            <form onSubmit={handleClick}>
            <div className="lg:w-2/3 w-full flex py-4 items-center">
            <input
          type="text"
          className="border rounded-md w-full px-2 py-3 rounded-r-none"
          placeholder="Enter project title"
        onChange={(e) => setNewTitle(e.target.value.trim())}
        required
        />
        {/* <button  className="border-l-0 border hover:bg-green-500 bg-green-700 rounded-l-none rounded-tl-0 rounded-md">
          <FiPlus className="text-5xl text-white py-1" />
        </button> */}
      </div>
      <button
      disabled={loading}
        type="submit"
        className="flex my-4 transition-all delay-150 duration-150 px-8 py-2 rounded text-white bg-[#103f59] "
      >
        {loading ?  <i className="fas fa-spinner fa-spin mr-2"></i> : "Save"}
      </button>

            </form>
      
    </div>
  );
};

export default AddTitle;
