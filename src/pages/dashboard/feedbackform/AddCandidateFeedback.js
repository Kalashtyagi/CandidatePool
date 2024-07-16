import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FaCheck, FaTimes, FaPlus, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import BackButton from "../../../components/BackButton";


export const AddCandidateFeedback = () => {
  const location = useLocation();
  const {id}=useParams();
  console.log("id",id)
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState("");
  const data = JSON.parse(localStorage.getItem("data"));
  const accessToken = data?.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const[candidateData,setCandidateData]=useState([])
  const[isLoading,setIsLoading]=useState(false);


  const getCandidateData=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}interview-schedule/showdata/${id}`,{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`${authorize}`
        }
      })
      if(response?.status===200){
        const result=response?.data?.data
        const lastRowData=result[result.length-1];
        setCandidateData(lastRowData)
      }
      console.log("resoponse",response)

    }catch(error){
      console.log(error);


    }
  }

  useEffect(()=>{
    getCandidateData();
  },[])

console.log("add",candidateData)

  console.log("iddd",candidateData?.job_application?.status_id)

  const getStatusMessage = () => {
    switch (candidateData?.job_application?.status_id) {
      case 3:
        return "Interview Round 1-Clear";
      case 4:
        return "Interview Round 2-Clear";
      default:
        return null;
    }
  };
  const getStatusMessage1 = () => {
    switch (candidateData?.job_application?.status_id) {
      case 3:
        return "Interview Round 1-Not Clear";
      case 4:
        return "Interview Round 2-Not Clear";
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();
  const statusMessage1 = getStatusMessage1();



  const handleAccept = async(e,status) => {
    if(remarks==""){
      toast.error("plz fill remark field");
      return ;
    }
    e.preventDefault();
    setIsLoading(true);
    try{
      const response=await axios.post(`${process.env.REACT_APP_API_URL}feedback/store`,{status:status,remark:remarks,interview_schedule_id:candidateData?.id,job_application_id:candidateData?.job_application?.id},{
        headers:{
          "Content-Type": "application/json",
          'Authorization': `${authorize}`
        }
      })
    console.log("response",response)
    if(response?.status===200){
      setIsLoading(false);
      console.log(response?.data?.message)
      toast.success(`${response?.data?.message}`)
      setTimeout(() => {
        navigate('/admin/candidatePool')

      }, 2000);

    }

    }catch(error){
      console.log(error)
      setIsLoading(false);
    }

    console.log("Candidate accepted with remarks:", remarks);
  };

  const handleReject = () => {
    console.log("Candidate rejected with remarks:", remarks);
  };

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div className="min-h-screen  bg-gradient-to-r from-blue-100 to-blue-300">
      <ToastContainer autoClose={3000} position="top-right"/> 

      <div className="relative bg-white shadow-lg rounded-lg p-6 max-w-full  h-full">
        <BackButton route={-1}/>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Candidate Feedback</h1>
        <div className="mb-6">
      
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
        <h3 className="text-lg font-medium text-gray-700">Name</h3>
        <p className="text-lg text-gray-600">{candidateData?.job_application?.full_name}</p></div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Email</h3>
            <p className="text-gray-600">{candidateData?.job_application?.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Phone</h3>
            <p className="text-gray-600">{candidateData?.job_application?.phone}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Company</h3>
            <p className="text-gray-600">{candidateData?.job_application?.CurrentCompanyName}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Experience</h3>
            <p className="text-gray-600">{candidateData?.job_application?.TotalExperience}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Key Skills</h3>
            <p className="text-gray-600">{candidateData?.job_application?.KeySkills}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Resume</h3>
            <a
              href={candidateData?.job_application?.ResumeLink}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Undergraduate Qualification:</h3>
            <p className="text-gray-600">{`${candidateData?.job_application?.UGSpecialization}, ${candidateData?.job_application?.UGUniversityName} (${candidateData?.job_application?.UGGraduationYear})`}</p>
          </div>
          {candidateData?.job_application?.PostGraduationDegree && (
            <div>
              <h3 className="text-lg font-medium text-gray-700">Postgraduate Qualification:</h3>
              <p className="text-gray-600">{`${candidateData?.job_application?.PostGraduationDegree} in ${candidateData?.job_application?.PGSpecialization}, ${candidateData?.job_application?.PGUniversityName} (${candidateData?.job_application?.PGGraduationYear})`}</p>
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-700">Interview Date & Time:</h3>
            <p className="text-gray-600">{candidateData?.job_application?.UpdatedOn}</p>

            {/* <p className="text-gray-600"><b>{CandidateStatuses[2]?.Status}</b>:{CandidateStatuses[2]?.CreatedAt}</p>
            <p className="text-gray-600">{CandidateStatuses[3]?.Status}:{CandidateStatuses[3]?.CreatedAt}</p> */}

          </div>
          <div className="col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">Remarks:</label>
            <textarea
              className="w-full p-2 text-gray-800 border rounded focus:outline-none focus:border-blue-600"
              rows="4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add your remarks here..."
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={(e) => handleAccept(e, statusMessage)}
            className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700 transition duration-200"
          >
            <FaCheck className="mr-1" />
         {isLoading ? <i className="fas fa-spinner fa-spin mr-2"></i>:"Accept"} 
          </button>
          <button
            onClick={(e) => handleAccept(e, statusMessage1)}
            className="px-6 py-3 bg-red-600 text-white rounded shadow hover:bg-red-700 transition duration-200"
          >
            <FaTimes className="mr-1" />
            {isLoading ? <i className="fas fa-spinner fa-spin mr-2"></i>:"Reject"} 
            </button>
        </div>
      </div>
      
      <ToastContainer autoClose={2000} position="top-right"/> 

    </div>
  );
};
