import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import SelectionFields from './SelectionFields'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import moment from 'moment/moment';
import axios from 'axios';
import { color } from 'framer-motion';
import Loading from '../../components/Loader';
import { useNavigate } from 'react-router';
import BackButton from '../../components/BackButton';
import { getCategory } from '../../Services/ProjectSevices';

const AddProject = ({editErfData,getERFList,selectedRadio,setSelectedRadio}) => { 

  const navigate = useNavigate();

  
  const apiUrl=process.env.REACT_APP_API_URL
  const [targetDate, setTargetDate] = useState('');
  const [requisition_date, setRequistion_Date] = useState('');

  const [recruitment_type, setRecruitment_Type] = useState("inhouse");
  const [selectedType, setSelectedType] = useState('');
  const[department_id,setDepartment_Id]=useState('');
  const[category_id,setCategory_id]=useState('')
  const[category,setCategory]=useState('');
  const [approved,setApproved]=useState('')
  const[title,setTitle]=useState('');
  const[billable_type,setBillable_Type]=useState('')
  const[projectName,setProjectName]=useState('')
  const[pid,setPid]=useState("")
  const[noOfPos,setNoOfPos]=useState()
  const[budget,setBudget]=useState("")
  const[loading,setLoading]=useState(false);
  const [checkForm, setCheckForm] = useState("inhouse");
  const [departmentList,setDepartmentList] = useState([])
  const[allProjectLead,setAllProjectLead]=useState([]);
  const[allCategory,setAllCategory]=useState([])
  const[project_lead,setProject_Lead]=useState('')
  
  const data = JSON.parse(localStorage.getItem("data"));
  
  const departmentListApi = async()=>{
    const request = await fetch(`${process.env.REACT_APP_API_URL}department`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data?.access_token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const jsonResponse = await request?.json();
    
    if (jsonResponse) {
      setDepartmentList(jsonResponse?.data.map((x)=>({label:x?.DepartmentName,value:x?.DepartmentId})));
    }
  }
  const getAllProjectLead=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}team/isprojectlead`,{
        headers: {
          Authorization: `Bearer ${data?.access_token}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      })
      if(response?.status===200){
        const data=await response?.data?.data;
        setAllProjectLead(data);
      }

    }catch(error){
      console.log(error);
    }
  }
 
  const getCategoryData=async()=>{
    try{
      const data=await getCategory();
      setAllCategory(data.length>0?data:[])
      console.log("ata",data);
    }catch(error){
      setAllCategory([])
      console.log(error);
    }
  }

  useEffect(()=>{
    departmentListApi()
    getAllProjectLead();
    getCategoryData();
  },[])
  console.log(departmentList)

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };
  const handleRadioChange = (e) => {
    setRecruitment_Type(e.target.value);
  };
  const handleDepartment=(e)=>{
    setDepartment_Id(e.target.value);
  }
 
  const handleApproval=(e)=>{
    setApproved(e.target.value)
  }
  const handleTitle=(e)=>{
    setTitle(e.target.value)
  }
  const handleBillable=(e)=>{
    setBillable_Type(e.target.value)
  }

  const handleDepartmentChange = (event) => {
    const selectedDepartmentId = event.target.value;
    setDepartment_Id(selectedDepartmentId)
  };
  const handleCategory=(e)=>{
    const select=e.target.value
    setCategory_id(select);
    // setCategory(e.target.value);
  }
console.log('depa',department_id)
const handleSubmit=async(e)=>{

  e.preventDefault();
  setLoading(true);
  try{
     
    const response=await axios.post(`${apiUrl}jobs/store`,{
      approved:approved,
      department_id:Number(department_id),
      category_id:Number(category_id),
      recruitment_type:recruitment_type,
      pid:recruitment_type=="onsite"?pid:'',
      project_name:recruitment_type=="onsite"?projectName:'',
      project_lead:project_lead,
      no_of_possion:recruitment_type=="onsite"?Number(noOfPos):null,
      budget:recruitment_type=="onsite"?budget:'',
      requisition_date:recruitment_type=="onsite"?requisition_date:'',
      target_date:recruitment_type=="onsite"?targetDate:'',
    }
    ,{
      headers:{
        Authorization: `Bearer ${data?.access_token}`,
        Accept: "application/json",
      }
    })
    if(response?.status===200){
      const data=await response?.data;
      toast.success('Project generate Sucessfully')
      setLoading(false);
      setTimeout(() => {
        navigate('/admin/newerf')
      },2000);
    }
    console.log(response);
  }catch(error){
    toast.error("something went wrong please try again")
    console.log(error);
    setLoading(false);
  }
  finally{
    setBillable_Type('')
    setProject_Lead('')
    setDepartment_Id('')
    setApproved('')
    setCategory('')
    setPid('')
    setProjectName('')
    setNoOfPos('')
    setBudget('')
    setTitle('')
    setRequistion_Date('')
    setTargetDate('')

    setLoading(false);

  }
}
console.log("pROJECTLEAD",allCategory)
  return (
    <>
     <ToastContainer autoClose={3000} position="top-right"/>
     <div className="w-full p-2 overflow-y-auto max-h-[calc(100vh-50px)]">
    <BackButton route={-1}/>
      <div className="lg:p-1.5 pb-6 pt-2 w-full inline-block align-middle">
        <div className="grid grid-cols-1">
     <div className="flex justify-center  p-5 min-h-bg-gradient-to-r from-blue-100 to-blue-200 screen">
        <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto" style={{ margin: '20px' }}  onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-8 text-center " style={{color:"#334155"}}>Project Details</h2>

        <div className="flex justify-center mb-6">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="recruitment_type"
                value="inhouse"
                checked={recruitment_type==="inhouse"}
                onChange={handleRadioChange}
              />
              <span className="ml-2 text-gray-700">Inhouse</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="recruitment_type"
                value="onsite"
                checked={recruitment_type=== "onsite"}
                onChange={handleRadioChange}
              />
              <span className="ml-2 text-gray-700">Onsite</span>
            </label>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
         
         {recruitment_type=="onsite" && ( 
          <div>
          <label htmlFor="pid" className="block text-gray-700 mb-1">PID</label>
          <input
          required
            type="text"
            id="pid"
            value={pid}
            onChange={(e)=>setPid(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
          />
        </div>

         )}  
         {recruitment_type=="onsite" && (
          <div>
          <label htmlFor="projectName" className="block text-gray-700 mb-1">Project Name</label>
          <input
          required
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e)=>setProjectName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
          />
        </div>
         )}
         
         {recruitment_type=="onsite" && (

          <div>
      <label htmlFor="projectLeader" className="block text-gray-700 mb-1">Project Leader</label>
      <select
      required
        id="projectLeader"
        // value={selectedProjectLeader}
        onChange={(e) => setProject_Lead(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
      >
        <option value="">Select Project Leader</option>
        {allProjectLead?.map((leader) => (
          <option key={leader.id} value={leader.id}>{leader.name}</option>
        ))}
      </select>
    </div>
     )}
          <div>
            <label htmlFor="approval" className="block text-gray-700 mb-1">Approval</label>
            <select
            required
              id="approval"
              value={approved}
              onChange={handleApproval}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
            >
              <option value="">Select Approval</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

        
 <div>
      <label htmlFor="department" className="block text-gray-700 mb-1">Department</label>
      <select
      required
        id="department"
        value={department_id}
        onChange={handleDepartmentChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
      >
        <option value="">Select Department</option>
        {departmentList.length>0  && departmentList.map(departmentList => (
          <option key={departmentList.value} value={departmentList.value}>{departmentList.label}</option>
        ))}
      </select>
    </div>
          <div>
            <label htmlFor="category" className="block text-gray-700 mb-1">Select Category</label>
            <select
            required
              id="category"
              // value={category}
              onChange={handleCategory}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
            >
               <option value="">Select Category</option>
        {allCategory.length>0  && allCategory.map(allCategory => (
          <option key={allCategory?.id} value={allCategory?.id}>{allCategory?.name}</option>
        ))}
            </select>
          </div>

         

         
         
          {recruitment_type === "onsite" && (
              <>
                             <div>
            <label htmlFor="approval" className="block text-gray-700 mb-1">Billable</label>
            <select
            required
              id="title"
              value={billable_type}
              onChange={handleBillable}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
            >
              <option >Select Billable Type</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>    
                

              
              
          <div>
                  <label htmlFor="pid" className="block text-gray-700 mb-1">No of Position</label>
                  <input
                  required
                    type="text"
                    id="pos"
                    value={noOfPos}
                    onChange={(e)=>setNoOfPos(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="pid" className="block text-gray-700 mb-1">Budget</label>
                  <input
                  required
                  type='number'
                    id="budget"
                    value={budget}
                    onChange={(e)=>setBudget(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
                  />
                </div>
                <div>
              <label htmlFor="requestDate" className="block text-gray-700 mb-1">Request Date</label>
              <input
              required
                type="date"
                id="requestDate"
                value={requisition_date}
                onChange={(e)=>setRequistion_Date(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
              />
            </div>

                <div>
              <label htmlFor="targetDate" className="block text-gray-700 mb-1">Target Date</label>
              <input
              required
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e)=>setTargetDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
              />
            </div>
          
              </>
            )}
        </div>
        <div className="flex justify-center">
        <button
  type="submit"
  className="w-1/3 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
  style={{ backgroundColor: "#334155" }}
  disabled={loading} 
>
  {loading ?  <i className="fas fa-spinner fa-spin mr-2"></i> : "Submit"} 
</button>
          </div>
      </form>
    </div>       </div>   

    </div>
     
   
    </div> 
  

      
   
 


    </>
  )
}

export default AddProject;