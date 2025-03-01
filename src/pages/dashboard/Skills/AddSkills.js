import React, { useEffect, useState } from "react";
import Select from 'react-select'
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BackButton from "../../../components/BackButton";

const AddSkills = () => {
  const navigate = useNavigate()
  const [categoryList, setCategoryList] = useState('')
  const[loading,setLoading] = useState(false);
  const [skill, setSkill] = useState('')
  const [category, setCategory] = useState('')
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const location = useLocation()
  const accessToken = jsonData.access_token;
  const authorize = "Bearer" + " " + accessToken;

  const categoriesListApi = async () => {
    const requestCategory = await axios.get(`${process.env.REACT_APP_API_URL}jobcategories`, {
      headers: {
        'Authorization': `${authorize}`
      }
    })
    const categoryResponse = await requestCategory.data
    // console.log('Categories', categoryResponse)
    if (categoryResponse?.data.length > 0) {
      setCategoryList(categoryResponse)
    }
  }
const handleSubmit = async(e) =>{
  e.preventDefault();
    try {
      setLoading(true);
      const request = await fetch(`${process.env.REACT_APP_API_URL}skill/add`, {
        headers: {
          'Authorization': `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        method: "post",
        body: JSON.stringify({
          name: `${skill}`,
          category_id: `${category}`
        })
      })
      const response = await request?.json()
      if (response?.code === 200) {
        toast.success(`${response?.message}`)
        setTimeout(() => {
          navigate('/admin/jobskill')
        }, 3000)
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
  }

  useEffect(() => {
    categoriesListApi()
    document.title = "CIPLCRM | Add Skills"
  }, [location])

  useEffect(() => {
    if (jsonData?.data?.userPermissions.find(a => a === "add_skills")) {
      return
    } else {
      navigate('/admin')
    }

  }, [location])

  return (
    <div className="m-2 bg-white">
      <ToastContainer autoClose={3000} position="top-right"/>
      <div className="rounded border shadow-md p-4">
    <BackButton route="/admin/jobskill"/>
        <h4 className="card-title mb-4 text-2xl font-medium">Create New</h4>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-9">
              <div className="form-group">                
                <label htmlFor="address" className="text-xl font-medium">Job Categories:</label>
           
                <Select
                required
                  options={categoryList?.data?.map((category) => ({
                    "value": category?.id,
                    "label": category?.name
                  }))}
                  onChange={(e) => setCategory(e.value)}
                  isMulti={false}
                  isClearable
                  className="block lg:w-2/3 w-full py-3 px-2 my-2 rounded-md border "
                />
              </div>
            </div>
          </div>

          <div id="education_fields">
            <div className="row">
              <div className="col-sm-9 nopadding">
                <div className="form-group">
                  <div className="input-group">
                    <div className="lg:w-2/3 w-full flex items-center">
                      <input
                      required
                        type="text"
                        className="border rounded-md w-full px-2 py-3 rounded-r-none"
                        placeholder="Enter Skill Name"
                        onChange={(e) => setSkill(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button disabled={loading} type="submit" id="" className="flex my-4 px-8 py-2 rounded text-white bg-[#103f59]"
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSkills;
