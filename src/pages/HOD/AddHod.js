import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import axios from 'axios';
import BackButton from '../../components/BackButton';


const AddHod = () => {
  const [newDepartment, setNewDepartment] = useState("Enter New Department Name");
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation()
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const accessToken = jsonData.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const [departmentList,setDepartmentList]=useState('')
  const [postData,setPostData]=useState({
    Name:'',
    Email:'',
    MobileNo:'',
    DepartmentId:''
  })
  const handleChange=async(e)=>{
        setPostData({...postData,[e.target.name]:e.target.value})
  }
  const handleSelectChange = (selectedOption) => {
    setPostData({ ...postData, DepartmentId: selectedOption ? selectedOption.value : '' });
  };

  const departmentApi = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}department`, {
      headers: {
        'Authorization': `${authorize}`
      }
    })
    const result = await response?.data
    if (result?.data.length > 0) {
      setDepartmentList(result)
    }
  }
  useEffect(() => {
    departmentApi()
    document.title = "CIPLCRM | Add Specializations"
  }, [location])
  console.log("department",departmentList);

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(postData);
    try {
      const request = await fetch(`${baseUrl}hod`, {
        method: "post",
        headers: {
          'Authorization': `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(postData),
      });
      const response = await request.json()
      if (response?.code === 201) {
        toast.success(`${response?.message}`)
        // navigate('/admin/hod')
        setTimeout(() =>
          navigate("/admin/hod")
          , 2000)
        // clearTimeout()
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
  };


  useEffect(() => {
    document.title = "CIPLCRM | Add Department"
    if (jsonData?.data?.userPermissions.find(a => a === "add_department")) {
      return
    } else {
      navigate('/admin')
    }
  }, [location])
  return (

<div className="border rounded p-4 mx-4 my-2 bg-white">
      <ToastContainer autoClose={3000} position="top-right" />
      <BackButton route="/admin/hod"/>
      <h1 className="text-2xl text-left px-2">Add Department:</h1>

      <div className="flex flex-cols">
        <div  className="w-full px-6 pt-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
             Name
          </label>
          <input
            type="text"
            id="name"
            name="Name"
            className="border rounded-md w-full px-2 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter  Name"
            value={postData?.Name}
            onChange={handleChange}
          />
        </div>
        <div  className="w-full px-6 pt-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="Email"
            className="border rounded-md w-full px-2 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Email"
            value={postData?.Email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-cols">
        <div className="w-full px-6 pt-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Contact
          </label>
          <input
            type="text"
            name="MobileNo"
            id="mobileno"
            className="border rounded-md w-full px-2 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Contact"
            value={postData?.MobileNo}
            onChange={handleChange}

          />
        </div>
        <div className="w-full px-6 pt-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Department Name
          </label>
          <Select
          name=" DepartmentId"
                   options={departmentList?.data?.map((skill) => ({
                    "value": skill?.id,
                    "label": skill?.name
                  }))}
                  onChange={handleSelectChange}
                  isMulti={false}
                  isClearable
                  className="block lg:w-2/3 w-full py-1 px-1 my-2 rounded-md border "
                />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          className="my-4 px-8 py-2 rounded text-white bg-green-700 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <span className="text-xl font-medium">Save</span>
        </button>
      </div>
    </div>
  )
}

export default AddHod;