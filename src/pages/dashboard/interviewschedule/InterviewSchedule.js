import axios from "axios";
import moment from "moment/moment";
import { MdEmail } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { getAllMrf } from "../../../Services/ProjectSevices";
import { searchCandidates } from "../../../Services/CandidateServices";
import { FaEye } from "react-icons/fa";

import {
  AiFillPlusCircle,
  AiOutlineDelete,
  AiOutlineHome,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { FaRegEdit, FaDatabase } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import Table from "../../../components/Table";
import { TbNewSection } from "react-icons/tb";
import { MdPreview } from "react-icons/md";
import InterviewReview from "./InterviewReview";
import InterviewScheduleStatus from "./InterviewScheduleStatus";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Select from "react-select";
import DataTable from "react-data-table-component";
import index from "../../../index.css";
import { BsDownload } from "react-icons/bs";
import { Document, Page } from "react-pdf";
import { BsFillEyeFill } from "react-icons/bs";
import toasthot from "react-hot-toast";
import { Circles } from 'react-loader-spinner';

const InterviewSchedule = () => {
  const [data, setData] = useState("");
  const [showTab, setShowTab] = useState("round 1");
  const [interviewReviewData, setInterviewReviewData] = useState("");
  const [showInterviewData, setShowInterviewData] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [candidateList, setCandidateList] = useState("");
  const [employeeList, setEmployeeList] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [interviewReview, setInterviewReview] = useState(false);
  const [showInterviewStatus, setShowInterviewStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [filteredDataPID, setFilteredDataPID] = useState("");
  const [showEditPopUp, setShowEditPopup] = useState(false);
  const [showApiErrorPopUp, setShowApiErrorPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [interviewPopup, setinterviewPopup] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValuepass, setSelectedValuePass] = useState(null);
  const [listForm, setListForm] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobRecruitmentData, setJobRecruitmentData] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [hodSearch, setHodSearch] = useState("");
  const [uploadid, setUploadId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [isuploaded, setIsuploaded] = useState(true);
  const [selectedType, setSelectedType] = useState("inhouse");
  const [inhouseData, setInhouseData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const[allMrfData,getAllMrfData]=useState([])
  const[selectMrfData,setSelectMrfData]=useState([])
  const[selectMrfId,setSelectMrfId]=useState('')
  const[showFeedback,setShowFeedback]=useState([])
  const jsonData = JSON.parse(localStorage.getItem("data"));
  console.log("jsondata",jsonData);
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMrf();
        console.log("data",data)
          getAllMrfData(data);
        const data1= await data?.filter((item)=>item?.job_id===0)
        setSelectMrfData(data1);
        console.log("data1",data1)
       
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

 const filterMrf=async()=>{
  if(selectedType=="inhouse"){
    const data=await allMrfData?.filter((item)=>item?.job_id===0)
    setSelectMrfData(data);
  }else if(selectedType=="onsite"){
    const data=await allMrfData?.filter((item)=>item?.job?.recruitment_type=="onsite")
    setSelectMrfData(data);
  }

 }
 useEffect(()=>{
  if(selectedType){
    filterMrf()


  }
 },[selectedType])
 console.log("selectmrfData",selectMrfData)

 useEffect(()=>{

        const fetchData=async()=>{
          if(selectMrfId ){
            const data= await searchCandidates(selectMrfId,showTab)
            setShowFeedback(data)
          }
        }
        fetchData();

  // if(selectMrfId){
  //   //  const data11=  searchCandidates(selectMrfId);
  //   //  setShowFeedback(data11);
  //   //  console.log("datatyty",data11)
  // }
 },[selectMrfId,showTab])
console.log("showfeedback",showFeedback)
  useEffect(() => {
    setLoading(true);
    const fetchData = async (type) => {
      const baseURL = 'http://127.0.0.1:8000/api/admin/interview-list/';
  
      // Determine the correct endpoint based on the selected type
      const urlEndpoint = selectedType === 'inhouse' ? 'inhouse' : 'onsite';
  
      // Construct the full URL
      const fullURL = `${baseURL}${type}`;
  
      try {
        const response = await axios.get(fullURL, {
          headers: {
            Authorization: authorize,
          },
        });
        if (response.data.code === 200) {
          if (type === 'inhouse') {
            setInhouseData(response.data.data);
          } else {
            setProjectData(response.data.data);
          }
        } else {
          if (type === 'inhouse') {
            setInhouseData([]);
          } else {
            setProjectData([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (type === 'inhouse') {
          setInhouseData([]);
        } else {
          setProjectData([]);
        }
      }finally {
        setLoading(false);
      }
    };
  
    fetchData(selectedType);
  }, [selectedType, authorize]);

  

  const handleRadioChange = (e) => {
    setSelectedType(e.target.value);
    setShowFeedback([])
  };

  useEffect(() => {
    setPdfUrl(filteredDataPID[0]?.result_url);
  }, [pdfUrl, filteredDataPID]);


  useEffect(() => {
    setFilteredDataPID([...filteredDataPID])

  }, [isuploaded])

  


  useEffect(() => {
    
    console.log("72", uploadid)

    console.log("63", filteredDataPID);
  }, [uploadid, filteredDataPID]);

  useEffect(() => {
    console.log(uploadid);
  }, [uploadid]);

  //   console.log("baseurl", baseUrl);
 
  // console.log("authorize", authorize);
  const navigate = useNavigate();
  const location = useLocation();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handlePopupSubmit = () => {
    console.log("Selected Value:", selectedValue);

    setinterviewPopup(false);
  };

  const handleUploadResult = (id) => {
    setinterviewPopup(true)

    setUploadId(id)

    console.log("106", id)
  }

  const getDataa = async () => {
    try{
      const getApiData = await axios.get(`${process.env.REACT_APP_API_URL}erf`, {
        headers: {
          Authorization: `${authorize}`,
        },
      });
      const apiResonse = await getApiData?.data;
      // console.log('api response',apiResonse)
      if (apiResonse) {
  
        setListForm(apiResonse?.data);
      }

    }catch(error){
      console.log(error);
    }

  
  };

  useEffect(() => {
    // getDataa();
  }, []);
  const getAssigneeData = async () => {
    // console.log("Jobd ID",jobId)

    if (jobId !== "" || null || undefined) {
      const formData = new FormData();
      formData.append("location", locationSearch);
      formData.append("project_manager", hodSearch);
      const request = await axios.postForm(
        `${process.env.REACT_APP_API_URL}job-application-list?type=onsite`,
        formData,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      // console.log("Request",request)
      const response = request.data;
      console.log("response", response);
      if (response) {
        setFilteredDataPID(response.data);
      }
    }
    if (jobId === "" || null || undefined) {
      toast.error("Please Select PID");
    }
  };

  useEffect(() => {
    // getAssigneeData();
  }, [interviewPopup]);

  const getEditData = async () => {
    try{

      const getApiData = await axios.get(
        `${process.env.REACT_APP_API_URL}interview/getdata`,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      const apiResonse = await getApiData?.data;
      // console.log("API Response",apiResonse)
      if (apiResonse?.code === 200) {
        setCandidateList(apiResonse?.data?.candidates);
        setEmployeeList(apiResonse?.data?.users);
      } else {
        // console.log("Api Response",apiResonse)
        setShowApiErrorPopUp(true);
        setApiError(apiResonse?.message);
      }
    }catch(error){
      console.log(error)
    }
   
    // console.log("API Response",apiResonse.data);
  };

 
  const getShowDataApi = async () => {
    try {
      // Log the URL and headers to debug
     
      const getApiData = await axios.get(
        `${process.env.REACT_APP_API_URL}interview-schedule/showdata/${interviewId}`,
        {
          headers: {
            Authorization: `${authorize}`,
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      
      const apiResponse = getApiData?.data;
      console.log("Show Data Api Response", apiResponse);
  
      if (apiResponse?.code === 200) {
        setShowInterviewData(apiResponse?.data);
      } else {
        setShowApiErrorPopUp(true);
        setApiError(apiResponse?.message);
      }
  
    } catch (error) {
      console.error("Error fetching show data:", error);
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Request data:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    }
  };
  
  const handleDownloadResume = (id) => {

    const link = document.createElement("a");
    const currTime = new Date().toLocaleTimeString;
    link.target = "_blank";
    link.href = id
    link.download = `'result${currTime}.pdf`;

    link.click();
  };

  useEffect(() => {
    if (interviewId) {
      getShowDataApi();
    }
  }, [interviewId]);
console.log("mrfid",selectMrfId)
  const getData = async () => {
    try{ 
      const getApiData = await axios.get(
        `${process.env.REACT_APP_API_URL}interview-list/${selectedType}`,
        {
          headers: {
            Authorization: `${authorize}`,
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const apiResonse = await getApiData?.data;
      console.log("API Response", apiResonse);
      if (apiResonse?.code === 200) {
        setData(apiResonse?.data);
        console.log("221", apiResonse.data);
      } else {
        console.log("Api Response", apiResonse);
        setShowApiErrorPopUp(true);
        setApiError(apiResonse?.message);
      }
      console.log("API Response", apiResonse.data);

    }catch(error){
      console.log(error)
    }
    
  };

  useEffect(() => {
    // getData();
    // getEditData();
    document.title = "CIPLCRM | Interview Schedule";
  },[location]);

  const handleSendInterviewFeedback = (obj) => {
    let { type, round, url_name, eid, id } = obj;

    console.log(obj);

    if (type == "interview round 1") {
      url_name = "ratingfeedback";
      round = "Interview Round 1"
    } else if (type == "interview round 2") {
      url_name = "ratingfeedbacktwo";
      round = "Interview Round 2"
    }

    console.log(url_name);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}sendratinglink/${id}/${eid}`,
        {
          url_name: url_name,
          round: round
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authorize}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const currentDateTime = new Date();

  const tableHeadingg = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      maxWidth: "fit-content",
    },
    {
      name: "Name",
      selector: (row) => 
        <button className="cursor text-slate"
         onClick={()=>navigate(`/admin/candidateprofile/${row.Id}`)}>
{row?.Name}
        </button>,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.EmailId,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row?.PhoneNumber,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => "In Process",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => moment(row?.schedule_date).utc().format("DD-MM-YYYY"),
      sortable: true,
    },
   
    {
      name: <div className="text-sm font-medium">Action</div>,
      selector: (row) => (
        <>
          <div className="flex justify-center">

            <>
              
                <div className="group flex items-center">
                  <button
                    onClick={() => {
                      navigate(`/admin/viewinterview/${row?.Id}`);
                    }}
                  >
                    <div className="relative text-center  rounded-sm">
                      <div className="group no-underline cursor-pointer relative inline-block text-center">
                        <FaEye
                          size={30}
                          className="hover:bg-white p-1 mr-1 text-xl"
                        />
                        <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                          View Interview
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

            </>            </div>


        </>
      ),
      sortable: false,
      allowOverflow: true,
      width: "full",
    },
    
  ];

  const tableHeading = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      maxWidth: "fit-content",
    },
    {
      name: "Name",
      selector: (row) => row?.full_name,
      sortable: true,
    },
    // {
    //   name: 'Recruiter Name',
    //   selector: (row) => row?.interviewer_name,
    //   sortable: true,
    // },
    {
      name: "Date",
      selector: (row) => moment(row?.schedule_date).utc().format("DD-MM-YYYY"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.status === "hired"
          ? "Hired"
          : row?.status === "pending"
            ? "Pending"
            : row?.status === "canceled"
              ? "Cancelled"
              : row?.status === "rejected"
                ? "Rejectecd"
                : row?.status === "interview round 1"
                  ? "Interview Round 1"
                  : row?.status === "assign round 1"
                    ? "Assign Round 1"
                    : row?.status === "assign round 2"
                      ? "Assign Round 2"
                      : row?.status === "interview round 2"
                        ? "Interview Round 2"
                        : row?.status === "assign round 1"
                          ? "Assign Round 1"
                          : "NA",
      sortable: true,
    },
  ]
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Circles color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
    
      <div>
        {interviewPopup && (
          <div className="popupcontainer">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Upload Result</h2>

              <form>
                <select
                  value={selectedValuepass}
                  onChange={(e) => setSelectedValuePass(e.target.value)}
                  className="input"
                  required
                >
                  <option selected disabled value="">
                    Select Pass/Fail
                  </option>
                  <option value={8}>Pass</option>
                  <option value={9}>Fail</option>
                </select>
                <div className=" pt-4 bg-grey-lighter">

                  <input
                    onChange={handleFileInputChange}
                    type="file"
                    required
                    className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-500 file:text-white hover:file:text-primary
                                hover:file:bg-gray-100
                                "
                  />
                </div>
                {/* <input type="file" /> */}
                <button
                  // onClick={handleUpload}
                  type="submit"
                  className="px-6 text-white font-semibold rounded py-2 bg-green-500 mt-4"
                >
                  Submit
                </button>
                <button
                  onClick={() => setinterviewPopup(false)}
                  className="px-6 text-white font-semibold rounded py-2 bg-green-500 ml-4 mt-4"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
<ToastContainer autoClose={3000} position="top-right"/>        {jsonData?.data?.userPermissions?.find((x) =>
          x?.includes("add_schedule")
        ) && showTab != "online" ? (
          <div className="lg:px-4 px-3">
            <div className="flex items-center justify-between">
              <span className="lg:text-xl text-lg">Interview Schedule</span>

              <div className="flex items-center">

                <span>
                  <Link to="/admin">
                    <AiOutlineHome size={30} className="text-primary px-1" />
                  </Link>
                </span>
                <span className="lg:text-xl text-lg">
                  {"/" + "Interview Schedule"}
                </span>

                {showTab === "hired" ? null : (
                  <button className="px-2 flex bg-gray-800 hover:bg-slate-700 text-white m-2 py-2 items-center rounded">
                    <span className="px-1">
                      <AiFillPlusCircle />
                    </span>
                    <Link
                      to={`/admin/addinterviewschedule`}
                      state={
                        showTab === "round 1"
                          ? "interview round 1"
                          : "interview round 2"
                      }
                    >
                      Add Interview Schedule
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
        
        <div className=" mx-4 ">
          <label >
          <input
            type="radio"
            value="inhouse"
            name="btn"
            checked={selectedType === "inhouse"}
            onChange={handleRadioChange}
          />
            <span className=' px-1 font-medium text-lg '>Inhouse</span>
          </label>

          <label className="mx-2">
          <input
            type="radio"
            value="onsite"
            name="btn"
            checked={selectedType === "onsite"}
            onChange={handleRadioChange}
          />
            <span className='px-1 font-medium text-lg '>Project</span>
          </label>
        </div>
        <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold mb-4 text-gray-800"></h1>
          <select className="mr-8 mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
          onChange={(e)=>setSelectMrfId(e.target.value)}
          >
            <option value="" >Please select Mrf</option>
            {selectMrfData && selectMrfData.map((item)=>(
              <option key={item?.id}
              value={item?.id}>
                {item.M_id}
              </option>
            ))}
          </select>
        {/* )} */}
      </div>
        {interviewReview ? (
          <InterviewReview
            getData={getData}
            interviewReviewData={interviewReviewData}
            setInterviewReview={setInterviewReview}
          />
        ) : null}
        {showApiErrorPopUp ? (
          <ApiErrorPopUp setModal={setShowApiErrorPopUp} error={apiError} />
        ) : null}
        {showInterviewStatus ? (
          <InterviewScheduleStatus
            getData={getData}
            interviewId={interviewId}
            setShowInterviewStatus={setShowInterviewStatus}
            data={showInterviewData}
          />
        ) : null}
       

        <div className="mt-4 px-4 rounded-md bg-white mx-4">
          <div className="flex flex-col">
            <div className="flex cursor-pointer mt-2">
           
            
             
              <div
                className={`px-4 ${showTab === "round 1" ? "bg-green-600" : "bg-gray-700"
                  } mr-1 py-2 text-white`}
                onClick={() => setShowTab("round 1")}
              >
                Interview Round 1
              </div>
              <div
                onClick={() => setShowTab("round 2")}
                className={`px-4 ${showTab === "round 2" ? "bg-green-600" : "bg-gray-700"
                  } mr-1 py-2 text-white`}
              >
                Interview Round 2
              </div>
            </div>
            <div className="grid grid-cols-1 rounded-md bg-white border-t-2 my-2 border-gray-700 transition-colors shadow ">
    <DataTable
      columns={tableHeadingg}
      data={showFeedback}
      // data={filteredDataPID}
      pagination
    />
  </div>

          
          </div>
        </div>
      </div>
      

)}</>
  );
};

export default InterviewSchedule;