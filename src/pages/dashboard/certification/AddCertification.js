import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import { ToastContainer, toast } from "react-toastify";
import Select from 'react-select'
import axios  from "axios";
import BackButton from "../../../components/BackButton";



const AddCertification = () => {
    const [newCertification, setNewCertification] = useState("Enter Certification Name");
    const [showApiErrorPopUp,setShowApiErrorPopUp] = useState(false)
    const [apiError,setApiError] = useState('')
    const [skillList,setSkillList]=useState('');
    const [skill,setSkill] = useState('')
    const[loading,setLoading] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const location = useLocation()
    // console.log("location data",location)
    const data = localStorage.getItem("data");
    const jsonData = JSON.parse(data);
    const accessToken = jsonData.access_token;
    const authorize = "Bearer" + " " + accessToken;

    const skillApi = async () => {
      try{
        const requestQualification = await axios.get(`${process.env.REACT_APP_API_URL}skill`, {
          headers: {
            'Authorization': `${authorize}`
          }
        })
        const qualificationResponse = await requestQualification?.data
        // console.log('Categories', categoryResponse)
        if (qualificationResponse?.data.length > 0) {
          setSkillList(qualificationResponse)
        }
      }catch(error){
        console.log(error);
      }
    }
    useEffect(() => {
      skillApi()
      document.title = "CIPLCRM | Add Specializations"
    }, [location])
  

    const handleClick = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const saveCertification =await fetch(`${baseUrl}certification/store`, {
          method: "post",
          headers: {
            'Authorization': `${authorize}`,
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            name: newCertification,
            skill_id:skill,
          }),
        });
        const response = await saveCertification.json()
        if(response?.code ===200){
          toast.success(`${response?.message}`)
          setTimeout(()=>{
            navigate('/admin/certification')
          },3000)
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
        console.log('error', error)
        if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error)
          console.log('Errors', errors)
          errors.map((x) => (
            toast.error(`${x}`)
          ))
        }
        if (error?.response?.data?.message) {
          if (error?.response?.data?.error) {
            const errors = Object.values(error?.response?.data?.error)
            console.log('Errors', errors)
            errors.map((x) => (
              toast.error(`${x}`)
            ))
          }
          if (error?.response?.data?.message) {
            toast.error(`${error?.response?.data?.message}`)
          }
        }
      }
      finally{
        setLoading(false);
      }
    };

    console.log("ss",skill);

    useEffect(()=>{
      document.title = "CIPLCRM | Add Certification"
      if(jsonData?.data?.userPermissions.find(a=>a === "add_category")){
        return
      }else{
        navigate('/admin')
      }
    },[location])
    return (
      <>
<ToastContainer autoClose={3000} position="top-right"/>    
  <div className="border rounded p-4 mx-4 my-2 bg-white">     
      <BackButton route={-1}/> 
        <h1 className="text-2xl text-left">Create New Certification:</h1>  
        <form onSubmit={handleClick}> 
        <div className="col-md-9">
              <div className="form-group">
                <Select
                required
                   options={skillList?.data?.map((skill) => ({
                    "value": skill?.id,
                    "label": skill?.name
                  }))}
                  onChange={(e) => setSkill(e.value)}
                  isMulti={false}
                  isClearable
                  className="block lg:w-2/3 w-full py-1 px-1 my-2 rounded-md border "
                />
              </div>
            </div>
        <div className="lg:w-2/3 w-full flex py-4 items-center">
          <input
          required
            type="text"
            className="border rounded-md w-full px-2 py-3 rounded-r-none"
            placeholder={newCertification}
          onChange={(e) => setNewCertification(e.target.value.trim())}
          />
        </div>
        <button
        disabled={loading}
          type="submit"
          className="flex my-4 transition-all delay-150 duration-150 px-8 py-2 rounded text-white bg-[#103f59]"
        >
         {loading ?  <i className="fas fa-spinner fa-spin mr-2"></i> : "Save"}
        </button>
        </form>
      
      </div>
      </>
    );
}

export default AddCertification