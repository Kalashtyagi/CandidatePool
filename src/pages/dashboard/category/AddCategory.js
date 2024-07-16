import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BackButton from "../../../components/BackButton";

const AddCategory = () => {
  const [newCategory, setNewCategory] = useState("Enter Job Category Name");
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
      const saveCategory =await fetch(`${baseUrl}jobcategories/store`, {
        method: "post",
        headers: {
          'Authorization': `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
         name:newCategory
        }),
      });
      console.log("job",saveCategory)
      const response = await saveCategory.json()
      // console.log('response',response?.error)
      if(response?.code===200){
        toast.success(`${response?.message}`)
        setTimeout(()=>{
          navigate("/admin/jobcategory");
        },4000)
        clearTimeout()
      }
      if(response?.error){
        const errors = Object.values(response?.error)
        console.error('Errors', errors)
        errors.map((x) => (
          toast.error(`${x}`)
        ))
      }
      
    } catch (error) {
    console.error('error', error)
        if (error?.response?.data?.error) {
        const errors = Object.values(error?.response?.data?.error)
        console.error('Errors', errors)
        errors.map((x) => (
          toast.error(`${x}`)
        ))
        }
        if (error?.response?.data?.message) {
          if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error)
          console.error('Errors', errors)
          errors.map((x) => (
            toast.error(`${x}`)
          ))
        }
        if (error?.response?.data?.message) {
          toast.error(`${error?.response?.data?.message}`)
        }
      }
      if (error) {
        console.log("erreos",error)
      const errors = Object.values(error)
      console.error('Errors', errors)
      errors.map((x) => (
        toast.error(`${x}`)
      ))
      }
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    document.title = "CIPLCRM | Add Category"
    if(jsonData?.data?.userPermissions.find(a=>a === "add_category")){
      return
    }else{
      navigate('/admin')
    }
  },[location])

  return (
    <div className="border rounded p-4 mx-4 my-2 bg-white">
       <ToastContainer autoClose={3000} position="top-right"/>
      <BackButton route="/admin/jobcategory"/>
      <h1 className="text-2xl text-left ">Create New Job Category</h1>
      <form onSubmit={handleClick}> 
      <div className="lg:w-2/3 w-full flex py-4 items-center">
        <input
        required
          type="text"
          className="border rounded-md w-full px-2 py-3 rounded-r-none"
          placeholder={newCategory}
        onChange={(e) => setNewCategory(e.target.value.trim())}
        />
        {/* <button  className="border-l-0 border hover:bg-green-500 bg-green-700 rounded-l-none rounded-tl-0 rounded-md">
          <FiPlus className="text-5xl text-white py-1" />
        </button> */}
      </div>
      <button
        type="submit"
        className=" w:40 flex my-4 transition-all delay-150 duration-150 px-8 py-2 rounded text-white bg-[#103f59] hover:bg-[#103f59]"
      >
        {loading ?  <i className="fas fa-spinner fa-spin mr-2"></i> : "Save"}
      </button>
      
      </form>
      
    </div>
  );
};

export default AddCategory;
