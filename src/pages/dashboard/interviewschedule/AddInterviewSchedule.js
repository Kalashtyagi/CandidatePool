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


const AddInterviewSchedule = () => {
 
  const [candidateList, setCandidateList] = useState([]);
  const { state } = useLocation();
  console.log("state", state);
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
  const [scheduleType, setScheduleType] = useState("inhouse");
  const [onSite, setOnSite] = useState([]);
  const [inHouseCandidate, setInHouseCandidate] = useState([]);
  const [onsiteCandidate, setOnsiteCandidate] = useState([]);
  const [mrfId, setMrfId] = useState(null);
  const [allMrfData, setAllMrfData] = useState([]);
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;

  const handleScheduleType = (e) => {
    setScheduleType(e.target.value);
    setAllMrfData([])
    reset()

  }
  const { register, handleSubmit, formState: { errors },reset,setValue } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {

          const formData = new FormData();
          formData.append("scheduleTime", data?.scheduleTime);
          formData.append("scheduleDate", data?.scheduleDate);
          formData.append("meeting_title",data?.meeting_title);
          formData.append("candidates", data?.candidate);
        
          formData.append("interview_type", data?.interview_type);
          formData.append("meetingurl", data.meetingurl);
          formData.append("comment", data?.comment);
          formData.append("employees[0][user_id]", data?.interviewer);
          formData.append("status", state);
          formData.append("name", name);
          formData.append("email", email);
          const saveInterviewSchedule = await axios.postForm(
            `${baseUrl}interview/store`,
            formData,
            {
              headers: {
                Authorization: `${authorize}`,
                "Content-Type": "multipart/form-data",
                Accept: "js",
              },
            }
          );
          const response = await saveInterviewSchedule;
          if (response?.status === 200) {
    
            // toast.success(`${response?.message}`);
            toast.success(" Interview scheduled  successfully");
            reset();
            setLoading(false);

    
            setTimeout(() => navigate("/admin/interviewschedule"), 2000);
          }
        } catch (error) {
          console.log("error", error);
          setLoading(false);
    }
    // console.log(data);
    // reset()
    // setCandidateId('')
  }
  const getErfData = async () => {
    try {

      const getApiData = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/onsite`, {
        headers: {
          Authorization: `${authorize}`,
        },
      });
      console.log("reaponseroeioe", getApiData)
      if (getApiData?.status == 200) {
        setErfData(getApiData?.data?.data)
      }
    } catch (error) {
      setErfData([])
      console.log("error", error);
    }

  };
  useEffect(() => {

    getErfData();


  }, [scheduleType == "onsite"]);

  useEffect(() => {
      const fetchData = async () => {
        if (scheduleType == "inhouse") {

        const data = await getAllMrf();
        setAllMrfData(data && data.length >=0 && data?.filter((item) => item.job?.recruitment_type == scheduleType));
        }

      }
      fetchData();
  }, [])
  const getData = async () => {
    try {
      const getApiData = await axios.get(`${baseUrl}interview/getdata`, {
        headers: {
          Authorization: `${authorize}`,
        },
      });
      const apiResonse = await getApiData?.data;
      if (apiResonse?.code === 200) {
        // setCandidateList(apiResonse?.data?.candidates);
        setEmployeeList(apiResonse?.data?.users);
      }
      else {
        setShowApiErrorPopUp(true);
        setApiError(apiResonse?.message);
      }

    } catch (error) {
      console.log("error", error);

    }
  };
  const interviewCandidateData = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}candidates/SearchCandidates`, { status: "ShortListed" }, {
        headers: {
          Authorization: `${authorize}`,

        }
      })
      // console.log("response",response?.data?.data?.candidates)
      if (response?.status === 200) {
        const filter = await response?.data?.data?.candidates


      }
    }
    catch (error) {
      console.log("error", error)
    }
  }
  //  useEffect(()=>{
  //   interviewCandidateData();
  //  },[])
  const getonsite = async () => {
    try {
      const request = await axios.get(
        `${process.env.REACT_APP_API_URL}job-application-list?type=onsite`,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      const response = request?.data;
      if (response) {
        setOnSite(response?.data);
      }

    } catch (error) {
      console.log(error);
    }

  };

  const getAssigneeData = async () => {
    try {
      const request = await axios.get(
        `${process.env.REACT_APP_API_URL}job-application-list?type=inhouse`,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      if (request?.status == 200) {
        setInHouseCandidate(request?.data?.data);
      }
    } catch (error) {
      console.log(error)
      setInHouseCandidate([])
    }

  };

  const getAssigneeDatapid = async () => {
    try {
      const request = await axios.get(
        `${process.env.REACT_APP_API_URL}leadstest/${jobId}`,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      console.log("Response", request)
      if (request?.status == 200) {

        setAllMrfData(request?.data?.data)

      }
    } catch (error) {

    }

  };
  let status_id;
  const getCandidate = async () => {
    if (mrfId != null) {
      if (state == "interview round 1") {
        status_id = 2
      }
      else {
        status_id = 11
      }

      try {

        const searchApiData = await axios.post(`${baseUrl}candidates/SearchCandidates`, { MRFId: mrfId, status_id: status_id }, {
          headers: {
            'Authorization': `${authorize}`
          }
        });
        console.log("seracapidata", searchApiData)
        if (searchApiData?.status === 200) {
          if (status_id == 2) {
            // const data=searchApiData?.data?.data?.candidates?.filter((item)=>item.CandidateStatuses.length<3 && item.CandidateStatuses[1].Status=="ShortListed")
            const data = searchApiData?.data?.data?.candidates?.filter((item) => item.CandidateStatus == "ShortListed");
            console.log("data", data)
            setCandidateList(data)
          } else {
            const data = searchApiData?.data?.data?.candidates?.filter((item) => item.CandidateStatus == "Interview Round 1-Clear");
            console.log("data", data)
            setCandidateList(data)
          }


        }
      } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message)
      }
    }

  }

  useEffect(() => {
    if(mrfId){
      getCandidate()

    }
  }, [mrfId])
  console.log("candidateList", candidateList)
  useEffect(() => {

    // getAssigneeData();
    getonsite();
    getData()
  }, []);

  useEffect(() => {
    if (jobId) {
      getAssigneeDatapid();
    }
  }, [jobId]);



  useEffect(() => {
    document.title = "CIPLCRM | Add Interview Schedule";
    if (jsonData?.data?.userPermissions.find((a) => a === "add_schedule")) {
      return;
    } else {
      navigate("/admin");
    }
  }, [location]);
  console.log("jobapplicationid", candidateId)
  console.log("MrfId",mrfId)
 
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
              checked={scheduleType === "inhouse"}
              // onChange={(e) => {
              //   setScheduleType(e.target.value);
              // }}
              onChange={handleScheduleType}

            />{" "}
            Inhouse
          </label>
          <label className="px-1 font-medium text-lg">
            <input
              type="radio"
              value="onsite"
              checked={scheduleType === "onsite"}
              onChange={handleScheduleType}

            // onChange={(e) => {
            //   setScheduleType(e.target.value);
            //  // Assuming setOnSite is a function to update the state for 'onSite'
            // }}
            />{" "}
            Project
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
          {...register("meeting_title", {
            required: "Meeting title is Required",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Only alphabetical characters are allowed",
            },
          })}
          // onChange={(e) => setTitle(e.target.value.trim())}
        />
        {errors.meeting_title && (
          <span className="text-red-500 text-sm">{errors.meeting_title.message}</span>
        )}
              </div>
              <div className="w-full">
                <label className="flex pr-1">
                  Interview Type <span className="text-red-400">*</span>
                </label>
                <select
                value={interviewType}
                
          className="border w-full px-2 py-2"
          {...register("interview_type", {
            required: "Interview type is required",
          })}
          onChange={(e)=>setInterviewType(e.target.value)}
        >
          <option value="">Choose Interview Type</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        {errors.interview_type && (
          <span className="text-red-500 text-sm">
            {errors.interview_type.message}
          </span>
        )}
              </div>
              {interviewType !== "offline" && (
                <div className="w-full mr-1">
                  <label className="flex pr-1">
                    Meeting URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    
                    className="border  w-full px-2 py-2"
                    placeholder={"Enter Meeting URL"}
                    {...register("meetingurl", {
                      required: "Meeting URL is required",
                      pattern: {
                        value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                        message: "Invalid URL",
                      },
                    })}
                  />
                   {errors?.meetingurl && (
                  <span className="text-red-500 text-sm">{errors.meetingurl.message}</span>

                )}
                </div>
              )}
              {scheduleType === "onsite" && (
                <div className="w-full ">
                  <div className="w-full">
                    <label className="flex">
                      PID <span className="text-red-400">*</span>
                    </label>
                   
         <select
          className="w-full border p-2"
          {...register("PID", { required: "PID is required" })}
          // onChange={(e) => setJobId(e.target.value)}
          onChange={(e) => {
            setJobId(e.target.value);
            setValue("PID", e.target.value, { shouldValidate: true });
          }}
        >
          <option value="">Select PID</option>
          {erfData &&
            erfData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.pid || option.id}
              </option>
            ))}
        </select>
        {errors.PID && (
          <span className="text-red-500 text-sm">{errors.PID.message}</span>
        )}
                    
                    {/* )} */}
                  </div>
                </div>
              )}

              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    MrfId <span className="text-red-400">*</span>
                  </label>

                  <select
          className="w-full border p-2"
          {...register("MRFId", { required: "MRFId is required" })}
          // onChange={(e) => setMrfId(e.target.value)}
          onChange={(e) => {
            setMrfId(e.target.value);
            setValue("MRFId", e.target.value, { shouldValidate: true });
          }}

        >
          <option value="">Select MrfId</option>
          {allMrfData &&
            allMrfData.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.M_id || candidate.id}
              </option>
            ))}
        </select>
        {errors.MRFId && (
          <span className="text-red-500 text-sm">{errors.MRFId.message}</span>
        )}
                </div>
              </div>

              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    Candidate <span className="text-red-400">*</span>
                  </label>
                  <select
          className="w-full border p-2"
          // {...register("candidate", { required: "candidate is required" })}
          onChange={(e) => {
            setCandidateId(e.target.value);
            setValue("candidate", e.target.value, { shouldValidate: true });
          }}
        >
          <option value="">Select candidate</option>
          {candidateList &&
            candidateList.map((candidate) => (
              <option key={candidate.id} value={candidate.Id}>
                {candidate.Name}
              </option>
            ))}
        </select>
                  
                   {/* {errors?.candidate && (
                  <span className="text-red-500 text-sm" style={{position:"relative"}}>{errors.candidate.message}</span>

                )} */}

                </div>
              </div>
              <div className="w-full ">
                <div className="w-full">
                  <label className="flex pr-1">
                    Interviewer <span className="text-red-400">*</span>
                  </label>
                  <select
          className="w-full border p-2"
          {...register("interviewer", { required: "Interviewer is required" })}
          // onChange={(e) => setEmployeeId(e.target.value)}
          onChange={(e) => {
            setEmployeeId(e.target.value);
            setValue("interviewer", e.target.value, { shouldValidate: true });
          }}
        >
          <option value="">Choose Interviewer</option>
          {employeeList &&
            employeeList.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
        </select>
        {errors.interviewer && (
          <span className="text-red-500 text-sm">{errors.interviewer.message}</span>
        )}
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
                    type="date"
                    
                    className="border  w-full px-2 py-2"
                    onChange={(e) => setScheduleDate(e.target.value)}
                    {...register("scheduleDate", { required: "Date is required" })}

                  />
                   {errors?.scheduleDate && (
                  <span className="text-red-500 text-sm">{errors.scheduleDate.message}</span>

                )}
                </div>
                <div className="w-full ml-1">
                  <label className="flex pr-1">
                    Schedule Time <span className="text-red-400">*</span>
                  </label>
                  <input
          type="time"
          className="border w-full px-2 py-2"
          onChange={(e) => setScheduleTime(e.target.value)}
          {...register("scheduleTime", { required: "Time is required" })}
        />
        {errors.scheduleTime && (
          <span className="text-red-500 text-sm">{errors.scheduleTime.message}</span>
        )}
                </div>
              </div>
              <div className="w-full col-span-2">
                <div className="w-full">
                  <label className="flex pr-1">Comment</label>
                  <textarea
                    type="text"
                    className="border  w-full px-2 py-2"
                    onChange={(e) => setComments(e.target.value.trim())}
                    {...register("comment", { required: "comment is required" })}

                  ></textarea>
                   {errors?.comment && (
                  <span className="text-red-500 text-sm">{errors.comment.message}</span>

                )}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w:40 flex my-4 transition-all delay-150 duration-150 px-8 py-2 rounded text-white bg-[#103f59]  hover:bg-[#103f59] "
          >
            <span className="text-xl font-medium">{loading ?  <i className="fas fa-spinner fa-spin mr-2"></i> : "Save"}</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default AddInterviewSchedule;