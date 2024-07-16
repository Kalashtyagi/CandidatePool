import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { warning } from "framer-motion";
import { getAllMrf } from "../../../Services/ProjectSevices"
import { useForm } from "react-hook-form";
import BackButton from "../../../components/BackButton";
import { useParams } from "react-router-dom";

const ViewInterview = () => {
 
    const params=useParams();
    const {id}=params;
    console.log("params",id);
  const [candidateList, setCandidateList] = useState([]);
 
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [comments, setComments] = useState("");
  const [erfData, setErfData] = useState([]);
  const [interviewType, setInterviewType] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [title, setTitle] = useState("");
  const [showApiErrorPopUp, setShowApiErrorPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("location data",location)
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const [inHouseCandidate, setInHouseCandidate] = useState([]);
  const [onsiteCandidate, setOnsiteCandidate] = useState([]);
  const [mrfId, setMrfId] = useState(null);
  const [allMrfData, setAllMrfData] = useState([]);
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const[getInterviewData,setGetInterviewData]=useState([])
  const [scheduleType, setScheduleType] = useState('');


  const handleScheduleType = (e) => {
    setScheduleType(e.target.value);
    setAllMrfData([])
    reset()

  }
  const { register, handleSubmit, formState: { errors },reset,setValue } = useForm();
 

 const fetchData=async()=>{
    try{
        const response=await axios.get(`${process.env.REACT_APP_API_URL}interview-schedule/getInterview/${id}`,{
            headers:{
                Authorization:`${authorize}`
            }
        })
        if(response?.status==200){
            setGetInterviewData(response?.data?.data)

        }
        console.log("response",response)

    }catch(error){
        console.log(error)
    }
 }
 useEffect(()=>{
    fetchData();
 },[])
 useEffect(() => {
    if (getInterviewData) {
      setScheduleType(getInterviewData?.recruitment_type);
    }
  }, [getInterviewData]);

//  console.log("setINTERVIEWdATA",getInterviewData?.recruitment_type)

 console.log("SchedultType",scheduleType)



  useEffect(() => {
    document.title = "CIPLCRM | Add Interview Schedule";
    if (jsonData?.data?.userPermissions.find((a) => a === "add_schedule")) {
      return;
    } else {
      navigate("/admin");
    }
  }, [location]);
  console.log("jobapplicationid", candidateId)
 
  return (
    <>
      <ToastContainer autoClose={3000} position="top-right" />      {showApiErrorPopUp ? (
        <ApiErrorPopUp
          setModal={setShowApiErrorPopUp}
          error={apiError && apiError}
        />
      ) : null}

      <div className="border rounded border-t-2 border-r-gray-400 border-l-gray-400 border-b-gray-400 border-gray-800 p-4 mx-4 my-2 bg-white">
        <BackButton route={-1}/>
        <h1 className="text-2xl text-left ">Create Interview Schedule</h1>


        {/* Radio Buttons for Schedule Type */}
        <div className="mx-11 flex items-center mb-4">
          <label className="px-1 font-medium text-lg">
            <input
              type="radio"
              value="inhouse"
              checked={scheduleType == "inhouse"}
            //   onChange={handleRadioChange}              

            />{" "}
            Inhouse
          </label>
          <label className="px-1 font-medium text-lg">
            <input
              type="radio"
              value="onsite"
              checked={scheduleType == "onsite"}
            //   onChange={handleRadioChange}

           
            />{" "}
            Project
          </label>
        </div>

        <form >
          <div className=" w-full flex py-4 items-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="w-full mr-1">
                <label className="flex pr-1">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
          type="text"
          className="border w-full px-2 py-2"
          placeholder="Enter Interview Title"
          value={getInterviewData?.meeting_title}
          readOnly
         
        />
       
              </div>
              <div className="w-full">
                <label className="flex pr-1">
                  Interview Type <span className="text-red-400">*</span>
                </label>
                
        <input className="w-full border p-2" value={getInterviewData?.interview_type}           readOnly
        />
      
              </div>
              {interviewType !== "offline" && (
                <div className="w-full mr-1">
                  <label className="flex pr-1">
                    Meeting URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly

                    
                    className="border  w-full px-2 py-2"
                   value={getInterviewData?.meetingurl}
                  />
                   
                </div>
              )}
              {scheduleType === "onsite" && (
                <div className="w-full ">
                  <div className="w-full">
                    <label className="flex">
                      PID <span className="text-red-400">*</span>
                    </label>
                   
                    <input className="w-full border p-2" value={getInterviewData?.pid} readOnly/>

            
                    {/* )} */}
                  </div>
                </div>
              )}

              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    MrfId <span className="text-red-400">*</span>
                  </label>
                  

        <input className="w-full border p-2" value={getInterviewData?.M_id} readOnly/>

                </div>
              </div>

              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    Candidate <span className="text-red-400">*</span>
                  </label>
                  <input className="w-full border p-2" value={getInterviewData?.job_application?.name} readOnly/>

                  


                </div>
              </div>
              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    Interviewer <span className="text-red-400">*</span>
                  </label>
                  <input className="w-full border p-2" value={getInterviewData?.employee?.[0]?.user?.name} readOnly/>

                 
       
                </div>
              </div>

              {/* grid 2 */}
              <div className="w-full flex">
                <div className="w-full mr-1">
                  <label
                    className={
                      "flex pr-1 after:content-[" *
                      "] after:ml-0.5 after:text-red-500"
                    }
                  >
                    Date{" "}
                  </label>
                  <input
                    // type="date"
                    
                    className="border  w-full px-2 py-2"
                    value={getInterviewData?.schedule_date}
                    

                  />
                  
                </div>
                <div className="w-full ml-1">
                  <label className="flex pr-1">
                    Schedule Time <span className="text-red-400">*</span>
                  </label>
                  <input
          type="time"
          className="border w-full px-2 py-2"

        />
        
                </div>
              </div>
              <div className="w-full col-span-2">
                <div className="w-full">
                  <label className="flex pr-1">Comment</label>
                  <textarea
                    type="text"
                    className="border  w-full px-2 py-2"
                    value={getInterviewData?.comments?.[0]?.comment}
                  ></textarea>

                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ViewInterview;