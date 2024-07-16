import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaFileImport } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import BackButton from "../../../components/BackButton";

const AddAssignee = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  // form data
  const [name, setName] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const[jobTitle,setJobTitle] = useState("");
  const [address, setAddress] = useState("");
  const[currentLocation,setCurrentLocation] = useState("");
  const[preferredLocation,setPreferredLocation] = useState("");
  const[resumeHeadline,setResumeHeadline] = useState("");
  const[resumeSummary,setResumeSummary] = useState("");
  const[universityName,setUniversityName] = useState("");
  const[graduationYear,setGraduationYear] = useState("");
  const[gender,setGender] = useState("");
  const[industry,setIndustry] = useState("");
  const[annualSalary,setAnnualSalary] = useState("");
  const[maritalStatus,setMaritalStatus] = useState("");
  const[candidateSource,setCandidateSource] = useState("");
  const[resumeLink,setResumeLink]=useState("");


  const [qualification, setQualification] = useState("");
  const [subQualification, setSubQualification] = useState("");
  const [relevantExp, setRelevantExp] = useState("");
  const [totalExp, setTotalExp] = useState("");
  const[currentCompanyName,setCurrentCompanyName] = useState("");
  const[currentCompanyDesignation,setCurrentCompanyDesignation] = useState("");
  const[department,setDepartment] = useState("");
  const[role,setRole] = useState("");
  const[noticePeriod,setNoticePeriod] = useState("");
  const [skills, setSkills] = useState("");
  const [file, setFile] = useState("");
  const [fileDocument, setFileDocument] = useState("");
  const [bulkFile, setBulkFile] = useState("");
  const[dateOfBirth,setDateOfBirth] = useState("");
  const [fatherFirstName, setFatheFirstName] = useState("");
  const [fatherLastName, setFatherLastName] = useState("");
  const[permanentAddress,setPermanentAddress]=useState("")
  const[HomeTownOrCity,setHomeTownOrCity]=useState("")
  const [lastname, setLastname] = useState("");
  const [qualificationName,setQualificationName] = useState("");
  const[subQualificationName,setSubQualificationName] = useState("");
  const[pidMrf,setPIdMrf] = useState(false);
  const[mrfidOptions,setMrfIdOptions] = useState([]);
  const [pidOptions,setPidOptions] = useState([]);
  const [selectedPid,setSelectedPid] = useState("");
  const[mrfId,setMrfId] = useState("");
  const[job_id,setJob_id]=useState('');
  const[pinCode,setPincode]=useState('')
  const[first_name,setFirst_Name]=useState("")
  const[last_name,setLast_Name]=useState("")

  // data calling
  const [qualificationList, setQualificationList] = useState("");
  const [subQualificationList, setSubQualificationList] = useState("");
  const data = localStorage.getItem("data");
  const jsonData = JSON.parse(data);
  const location = useLocation();
  console.log('locaiton', location);
  const navigate = useNavigate();
  // console.log("sub qualification", subQualification)
  const accessToken = jsonData && jsonData?.access_token;
  // console.log("Graduation",graduation)
  const authorize = "Bearer" + " " + accessToken;
  const getQualificationApi = async () => {
    try{
      const request = await fetch(
        `${process.env.REACT_APP_API_URL}qualification`,
        {
          method: "GET",
          headers: {
            Authorization: `${authorize}`,
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const jsonResponse = await request?.json();
      // console.log("qualification",jsonResponse )
  
      if (jsonResponse) {
        setQualificationList(jsonResponse?.data);
      }

    }catch(error){
      console.log(error)

    }finally{

    }
   
  };

  const getSubQualificationApi = async () => {
    if (qualification) {
      console.log(
        JSON.stringify({
          qualification_id: `${qualification}`,
        })
      );
      const request = await fetch(
        `${process.env.REACT_APP_API_URL}subqualification/search`,
        {
          method: "post",
          headers: {
            Authorization: `${authorize}`,
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            qualification_id: `${qualification}`,
          }),
        }
      );
      const jsonResponse = await request?.json();
      console.log("qualification 91", jsonResponse);

      if (jsonResponse) {
        setSubQualificationList(jsonResponse?.data);
        console.log("95", jsonResponse);
      }
    }
  };

  let subqualificationListOption = [];

  useEffect(() => {
    console.log(subQualificationList);
  }, [subQualificationList]);

  if (Array.isArray(subQualificationList)) {
    subQualificationList?.map((ele) => {
      subqualificationListOption.push({
        value: ele?.id,
        label: ele?.name,
      });
    });
  }

  useEffect(() => {
    getSubQualificationApi();
  }, [qualification]);

  useEffect(() => {
    getQualificationApi();
  }, [subQualificationList]);

  

  const getPid = async() =>{
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/onsite`,{
        headers:{
          Authorization: `${authorize}`,
          "Content-Type":"application/json"
        }
      })
      setPidOptions(response?.data?.data);

    }catch(error){
      console.log(error);
    }
    
  }
  console.log("pidd",pidOptions);
  useEffect(()=>{
    if(location?.pathname === "/admin/addAssignee"){
      setPIdMrf(true);
      getPid();
    }
  },[location])

  const getMrfId = async () => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}leadstest/${selectedPid}`,{
        headers:{
          Authorization:`${authorize}`,
          "Content-Type":"application/json"
        }
      })
      console.log("response",response)
      if(response?.status===200){
        setMrfIdOptions(response?.data?.data)
        setJob_id(response?.data?.data?.[0]?.job_id)
      }
    }catch(error){
      console.log(error);
    }
   
    
  }
  useEffect(()=>{
    getMrfId();
  },[selectedPid])
  console.log("jbbbbbbbb",job_id)

  const saveData = async (e) => {
    
    e.preventDefault();
    // if(location?.pathname === "/admin/addAssignee" && mrfId==""){
    //   toast.warn("Please select MrfId first");
    //   return;
    // }
    try {
      setShowLoading(true);
      if(!gender){
        toast.warning("Please select gender")
        return;
      }
      if(!maritalStatus){
        toast.warning("Please select marital status")
        return;
      }
      if(!candidateSource){
        toast.warning("Please select source")
        return;
      }

      var formData = new FormData();
      formData.append("JobTitle",`${jobTitle}`);
      formData.append("DateOfApplication",new Date().toISOString());
      formData.append("first_name",`${first_name}`)
      formData.append("last_name",`${last_name}`)

      // formData.append("Name", `${name}`);
      formData.append("CurrentLocation",`${currentLocation}`);
      formData.append("PreferredLocations",`${preferredLocation}`);
      formData.append("EmailId", `${email}`);
      formData.append(`KeySkills`, `${skills}`);
      formData.append("PhoneNumber", `${phone}`);
      formData.append("fatherfirst",`${fatherFirstName}`)
      formData.append('fatherlast',`${fatherLastName}`)
      formData.append("PermanentAddress",`${permanentAddress}`)
      formData.append("HomeTownOrCity",`${HomeTownOrCity}`)
      formData.append("UnderGraduationDegree",`${qualificationName}`);
      formData.append("TotalExperience", `${totalExp}`)
      formData.append("CurrentCompanyName",`${currentCompanyName}`);
      formData.append("CurrentCompanyDesignation",`${currentCompanyDesignation}`);
      formData.append("Department",`${department}`);
      formData.append("ResumeHeadline",`${resumeHeadline}`)
      formData.append("Summary",`${resumeSummary}`)
      formData.append("UGUniversityName",`${universityName}`)
      formData.append("UGGraduationYear",`${graduationYear}`)
      formData.append("Gender",`${gender}`)
      formData.append("DateOfBirth",`${dateOfBirth}`)
      formData.append("Role",`${role}`);
      formData.append("Industry",`${industry}`);
      formData.append("ResumeLink",`${resumeLink}`)
      formData.append("AnnualSalary",`${annualSalary}`);
      formData.append("NoticePeriod",`${noticePeriod}`);
      formData.append("MaritalStatus",`${maritalStatus}`);
      formData.append("PinCode",`${pinCode}`)
      formData.append("IsActive",1)
      // formData.append("MRFId",(location?.state!==null)?`${location?.state?.id}`:mrfId);
      if (location?.state !== null) {
        formData.append("MRFId", `${location?.state?.id}`);
      } else if (mrfId) {
        formData.append("MRFId", mrfId);
      }

     
      // formData.append("qualification_id", `${qualification}`);
      for (let i = 0; i < subQualification.length; i++) {
        localStorage.setItem("subqualification_id", `${subQualification[i]}`);
      }
      formData.append('UGSpecialization',`${subQualificationName}`)     
      formData.append("relevent_exp", `${relevantExp}`);
     
      formData.append("job_id",(location?.state!==null)?`${location?.state?.job_id}`:job_id);


      // formData.append("jobrecruitment_id", location?.state?.id);
      const sendForm = await axios.postForm(
        `${process.env.REACT_APP_API_URL}candidates`,
        formData,
        {
          headers: {
            Authorization: `${authorize}`,
            "Content-Type": "multipart/form-data",
            Accept: "js",
          },
        }
      );
      const responseForm = await sendForm.data;
      console.log("Response form", responseForm);
      if (responseForm?.code === 201) {
        toast.success(`${responseForm?.message}`);
        setShowLoading(false);
        setTimeout(() => navigate("/admin/candidatePool"), 5000);
        clearTimeout();
      }
      else{
        toast.error(responseForm?.data);
      }
    } catch (error) {
      console.log("164 error", error);
      toast.error(error?.response?.data?.data);

      // if (error?.response?.data?.error?.details?.hasOwnProperty(full_name))

      console.log(
        "168",
        error?.response?.data?.error?.details?.hasOwnProperty("email")
      );

      if (error?.response?.data?.error?.details?.hasOwnProperty("email")) {
        toast?.error(error?.response?.data?.error?.details?.email[0]);
      } else {
        toast.error(error?.response?.data?.error?.details?.full_name[0]);
      }
      setShowLoading(false);
      if (error?.response?.data?.error) {
        const errors = Object.values(error?.response?.data?.error);
        console.log("Errors", errors);
        // errors.map((x) => toast.error(`${x}`));
      }
      if (error?.response?.data?.message) {
        if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error);
          console.log("Errors", errors);
          // errors.map((x) => toast.error(`${x}`));
        }
        if (error?.response?.data?.message) {
          // toast.error(`${error?.response?.data?.message}`);
        }
      }
    }
    finally{
      setShowLoading(false);
    }
  };

  const handleChangeFile = async (e) => {
    setFile(e.target.files[0]);
    if (name === "" || null || undefined) {
      try {
        const formData = new FormData();
        formData.append("resume", e.target.files[0]);
        const request = await axios.postForm(
          `${process.env.REACT_APP_API_URL}read-docx`,
          formData,
          {
            headers: {
              Authorization: `${authorize}`,
              "Content-Type": "multipart/form-data",
              Accept: "js",
            },
          }
        );
        const responseForm = await request.data;
        if (responseForm) {
        
          if (responseForm?.email) {
            setEmail(responseForm?.email);
          }
          if (responseForm?.mobile) {
            setPhone(responseForm?.mobile);
          } else {
            return null;
          }
        }
      } catch (error) {
        console.log("error", error);
        if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error);
          console.log("Errors", errors);
          errors.map((x) => toast.error(`${x}`));
        }
        if (error?.response?.data?.message) {
          if (error?.response?.data?.error) {
            const errors = Object.values(error?.response?.data?.error);
            console.log("Errors", errors);
            errors.map((x) => toast.error(`${x}`));
          }
          if (error?.response?.data?.message) {
            toast.error(`${error?.response?.data?.message}`);
          }
        }
      }
    }
  };

  const handleChangeDocumenFile = async (e) => {
    setFileDocument(e.target.files[0]);
    if (name === "" || null || undefined) {
      try {
        const formData = new FormData();
        formData.append("document", e.target.files[0]);
        const request = await axios.postForm(
          `${process.env.REACT_APP_API_URL}read-docx`,
          formData,
          {
            headers: {
              Authorization: `${authorize}`,
              "Content-Type": "multipart/form-data",
              Accept: "js",
            },
          }
        );
        const responseForm = await request.data;
        if (responseForm) {
       
          if (responseForm?.email) {
            setEmail(responseForm?.email);
          }
          if (responseForm?.mobile) {
            setPhone(responseForm?.mobile);
          } else {
            return null;
          }
        }
      } catch (error) {
        console.log("error", error);
        if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error);
          console.log("Errors", errors);
          errors.map((x) => toast.error(`${x}`));
        }
        if (error?.response?.data?.message) {
          if (error?.response?.data?.error) {
            const errors = Object.values(error?.response?.data?.error);
            console.log("Errors", errors);
            errors.map((x) => toast.error(`${x}`));
          }
          if (error?.response?.data?.message) {
            toast.error(`${error?.response?.data?.message}`);
          }
        }
      }
    }
  };


  const getSample = async () =>{
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}jobapplication/simple/data`,{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`${authorize}`
        },
        responseType: 'blob'
      })
       const blob = new Blob([response.data],{type:response.headers['content-type']})
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.style.display = 'none';
       a.href = url;
       a.download = 'sample_candidate.xlsx';
       document.body.appendChild(a);
       a.click();
       window.URL.revokeObjectURL(url);
    }catch(error){
      console.log(error);
    }

  }


  //candidate source
  const candidateSources = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Naukri.com', label: 'Naukri.com' },
    { value: 'Friend Referral', label: 'Friend Referral' },
    { value: 'Other', label: 'Other' }
  ];

  const handleSubQualification = (e) =>{
     setSubQualification(e?.map((x) => x?.value))
     setSubQualificationName(e?.map((x)=>x?.label)); 
  }


  console.log("subqual",subQualificationName);

  const handleQualification = (e) =>{
    setQualification(e?.value)
    setQualificationName(e?.label);
  }

  console.log("qualNa",qualificationName);


const handleSelectChange = (event) => {
  const selectedPid = event.target.value;
  const selectedOption = pidOptions.find(pid => pid.pid === selectedPid);
  setSelectedPid(selectedOption.id);
};

  return (
    
    <div className="overflow-y-auto max-h-[calc(110vh-150px)] scrollbar-custom">
<ToastContainer autoClose={3000} position="top-right"/> 
<div className="flex justify-between bg-white ">
  {pidMrf && (
     <div className="ml-5 mt-3">
     <select required className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700" onChange={handleSelectChange}>
     <option value="">Please select PId</option>
         {pidOptions?.map(pid => (
            <option 
            key={pid.id}
            value={pid.pid}
          >
            {pid.pid}
          </option>
         ))}
     </select>
     <select required onChange={(event)=>setMrfId(event.target.value)} className="ml-5 mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
     <option value="">Please select MRFID</option>
         {mrfidOptions?.map(mrfid => (
             <option key={mrfid.id} value={mrfid.id}>{mrfid?.M_id ??mrfid?.id}</option>
         ))}
     </select>
 </div>

  )}
           
            <div className="w-30">
               <BackButton route={-1}/>
            </div>
        </div>   
  <div className="p-4 border rounded shadow-md bg-white">
        
   
<h2 className="text-2xl">
  Add Candidate 
  {location?.pathname === '/admin/addassignee' && (
    <span className="text-blue-400">(PID - {`${location?.state?.job?.pid}`} and  <span className="text-gray-500"></span>MRf_Id - {location?.state?.M_id ||location?.state?.id})</span>
  )}
</h2>
    <AccordionLayout
          index={1}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          title="Bulk Import"
        >
          <div className="text-center p-3">
            <div className="flex justify-center">
              <FaFileImport className="text-neutral-900" size={30} />
            </div>
            <h2 className="text-xl font-bold py-4 ">Import File</h2>
            <div
              htmlFor="dropzone-file"
              className="border-2 p-4 cursor-pointer border-dashed border-neutral-900"
            >
              <div className="flex justify-center p-1">
                <input
                  id="dropzone-file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  type="file"
                  className="text-last-center"
                  onChange={(e) => setBulkFile(e.target.files[0])}
                />
              </div>
              <p className="text-sm text-neutral-800 px-8 ">
                Upload CSV or XLSX file only.{" "}
              </p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button
            disabled={showLoading}
              onClick={async () => {
                // if(location?.pathname === "/admin/addAssignee" && mrfId==""){
                //   toast.warn("Please select MrfId first");
                //   return;
                // }
                if (bulkFile) {
                  const formData = new FormData();
                  formData.append("import_file", bulkFile);
                  formData.append("job_id", (location?.state!==null)?`${location?.state?.job_id}`:job_id);
                  formData.append("jobrecruitment_id", (location?.state!==null)?`${location?.state?.id}`:mrfId);
                  formData.append("category_id", location?.state?.category_id);
                  try {
                    setShowLoading(true)
                    const sendFile = await axios.post(
                      `${process.env.REACT_APP_API_URL}jobapplication/import`,
                      formData,
                      {
                        headers: {
                          Authorization: `${authorize}`,
                          "Content-Type": "multipart/form-data",
                          Accept: "application/json",
                        },
                      }
                    );
                    const responseData = await sendFile?.data;
                    // console.log('response',responseData)
                    if (responseData?.code === 200) {
                      toast.success("Data Inserted Succesfully");
                      setTimeout(() => navigate(`/admin/candidatePool`), 4000);
                      clearTimeout();
                    }
                    // getData()
                  } catch (error) {
                    console.log("error", error);
                    if (error?.response?.data?.error) {
                      const errors = Object.values(
                        error?.response?.data?.error
                      );
                      console.log("Errors 1", errors);
                      errors.map((x) =>
                        // console.log("Error",x)
                        toast.error(`${x}`)
                      );
                    }
                    if (error?.response?.data?.message) {
                      if (error?.response?.data?.error) {
                        const errors = Object.values(
                          error?.response?.data?.error
                        );
                        console.log("Errors 2", errors);
                        errors.map((x) =>
                          // console.log("Error",x)
                          toast.error(`${x}`)
                        );
                      }
                      if (error?.response?.data?.message) {
                        toast.error(`${error?.response?.data?.message}`);
                      }
                    }
                  }
                  finally{
                    setShowLoading(false);
                  }
                } else {
                  toast.error("Please select file.!");
                }
                // setShowImportModal(false)
              }}
              className="mb-2 md:mb-0 bg-neutral-900 border border-neutral-900 px-5 py-2 text-sm  shadow-sm font-medium tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-neutral-800"
            >
              {showLoading?"submitting..":"Submit"}
            </button>
            {/* <a
              href={require("../../../assets/jobapplicationsampledata.xlsx")}
              download={"sample-sheet" + JSON.stringify(Date.now())}
            > */}
              <button onClick={getSample} className="mb-2 md:mb-0 bg-neutral-900 border border-neutral-900 px-5 py-2 text-sm  shadow-sm font-medium tracking-wider text-white  rounded-sm hover:shadow-lg hover:bg-neutral-800">
                Download Sample
              </button>
            {/* </a> */}
          </div>
        </AccordionLayout>
        <AccordionLayout
          index={2}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          title="Single Entry"
        >
          <form onSubmit={(e) => saveData(e)} method="multipart/form-data">
            <div className=" py-4 overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-custom">
              <div className="col-span-1 text-lg">
                <span>Personal Information</span>
                <label className="text-red-500 pl-1">*</label>
              </div>
              <div className="col-span-2 my-2 ">
                {/* <div className='w-full px-6'>
                <label className='text-lg'>Jobs</label>
                <select className='block border p-2 rounded w-full '>
                  <option>Choose Job</option>
                  <option>Python</option>
                  <option>NodeJs</option>
                </select>
                </div> */}
                <div className="flex flex-cols ">
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">First Name</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type={"text"}
                      onChange={(e) => setFirst_Name(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Last Name</label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type={"text"}
                      onChange={(e) => setLast_Name(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Last Name"
                      // required
                    />
                  </div>
                </div>
                
                <div className="flex flex-cols ">
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Phone</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      className="block border p-2 rounded w-full "
                      placeholder="Phone"
                      required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Email</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type={"email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Email"
                      required
                    />
                  </div>
                  
                </div>

                 
                <div className="flex flex-cols ">
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Father First Name</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type="text"
                      onChange={(e) => setFatheFirstName(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Fathe First Name"
                      required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Father Last Name</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                    type={"text"}
                      value={fatherLastName}
                      onChange={(e) =>setFatherLastName(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Father Last Name"
                      required
                    />
                  </div>
                  
                </div>

                <div className="flex flex-cols ">
                
                    <div className="w-full px-6 pt-2">
                    <label className="text-lg">Job Title</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type={"text"}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Job Title"
                      required
                    />
                  </div>
                    <div className="w-full px-6 pt-2">
                    <label className="text-lg">Current Company </label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type={"text"}
                      onChange={(e) => setCurrentCompanyName(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Current Company Name"
                      // required
                    />
                  </div>

                </div>
                <div className="flex flex-cols ">
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Current Company Designation</label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type="text"
                      value={currentCompanyDesignation}
                      onChange={(e) => setCurrentCompanyDesignation(e.target.value)}
                     
                      className="block border p-2 rounded w-full "
                      placeholder="Current Company Designation"
                      // required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Department</label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type={"text"}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="block border p-2 rounded w-full"
                      placeholder="Department"
                      // required
                    />
                  </div>
                   
                </div>
                <div className="flex flex-cols ">
                <div className="w-full px-6 pt-2">
                    <label className="text-lg">Role</label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type={"text"}
                      onChange={(e) => setRole(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Role"
                      // required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Industry</label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type={"text"}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Industry"
                      // required
                    />
                  </div>
                </div>
                <div className="flex flex-cols ">
                <div className="w-full px-6 pt-2">
                    <label className="text-lg">Annual Salary</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type="number"
                      onChange={(e) => setAnnualSalary(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Annual Salary"
                      required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Notice Period</label>
                    {/* <label className="px-1 text-red-500 ">*</label> */}
                    <input
                      type="text"
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Notice Period"
                      // required/
                    />
                  </div>
                </div>
               
                <div className="flex flex-cols ">
                <div className="w-full px-6 pt-2">
                    <label className="text-lg">Permanent Address</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type={"text"}
                      
                      onChange={(e) => setPermanentAddress(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="permanent address"
                      required
                    />
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Pincode</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type={"number"}
                      onChange={(e)=>setPincode(e.target.value)}
                      // onChange={(e) => setFatherlast(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="pincode"
                      required
                    />
                  </div>

                </div>
                <div className="flex flex-cols ">
                <div className="w-full px-6 pt-2">
                    <label className="text-lg">Gender</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <select onChange={(e) => setGender(e.target.value)}
                      className="block border p-2 rounded w-full "        
                      required
>
                      <option value="">Select Gender</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Transgender</option>


                    </select>
                   
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Marital Status</label>
                    <select onChange={(e) => setMaritalStatus(e.target.value)} className="block border p-2 rounded w-full " required>
                      <option>Select Marital Status</option>
                      <option>Married</option>
                      <option>Single</option>
                      <option>Divorced</option>
                    </select>
                   
                  </div>
                  <div className="w-full px-6 pt-2">
                    <label className="text-lg">Date of Birth</label>
                    <label className="px-1 text-red-500 ">*</label>
                    <input
                      type="date"
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="block border p-2 rounded w-full "
                      placeholder="Date of Birth"
                      required
                    />
                  </div>
                </div>
                <div className="w-full px-6 pt-2">
                  <label className="text-lg">Current Location</label>
                  <label className="px-1 text-red-500 ">*</label>

                  <textarea
                    className="block border p-2 rounded w-full"
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="w-full px-6 pt-2">
                  <label className="text-lg">Preferred Location</label>
                  <label className="px-1 text-red-500 ">*</label>

                  <textarea
                    className="block border p-2 rounded w-full "
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="w-full px-6 pt-2">
                  <label className="text-lg">Home Town Or City</label>
                  <label className="px-1 text-red-500 ">*</label>

                  <textarea
                    className="block border p-2 rounded w-full "
                    onChange={(e) => setHomeTownOrCity(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className=" col-span-3 mt-4">
                <hr />
              </div>

              <div className="flex flex-col">
                <div className="col-span-1 text-lg my-2">
                  <span>Experience</span>
                  {/* <label className="text-red-500 pl-1">*</label> */}
                </div>
                <div className="col-span-2 my-2 ">
                  <div className="flex flex-cols ">
                    <div className="w-full px-6 pt-2">
                      <label className="text-lg">Qualification</label>
                      <label className="text-red-500 pl-1">*</label>
                      <Select
                        options={
                          qualificationList?.length > 0
                            ? qualificationList &&
                              qualificationList?.map((x) => ({
                                value: x?.id,
                                label: x?.name,
                              }))
                            : [{ value: "", label: "Please Wait...!" }]
                        }
                        onChange={handleQualification}
                        isClearable
                        required
                      />
                    </div>
                    <div className="w-full px-6 pt-2">
                      <label className="text-lg">Specialization</label>
                      <label className="text-red-500 pl-1">*</label>
                      {console.log(" 542", subqualificationListOption)}
                      <Select
                        options={subqualificationListOption}
                        onChange={handleSubQualification
                          // (e) => setSubQualification(e?.map((x) => x?.value))
                          // console.log('567',e?.map((x) =>
                          //  x?.value))
                        }
                        isMulti={true}
                        isClearable
                        required
                      />
                      {/* <select required onChange={(e)=>setSubQualification(e.target.value)} className='block border p-2 rounded w-full '>
                      <option>Choose Job</option>
                      {
                        subQualificationList && subQualificationList?.map((subQualification)=>(
                          <option key={subQualification?.id} value={subQualification?.id}>{subQualification?.name}</option>
                        ))
                      }
                    </select> */}
                    </div>
                  </div>
                  <div className="flex flex-cols ">
                    <div className="w-full px-6 pt-2">
                      <label className="text-lg">Relevant Experience</label>

                      <input
                        type="text"
                        className="block border p-2 rounded w-full "
                        onChange={(e) => setRelevantExp(e.target.value)}
                        placeholder="Relevant Experience"
                        required
                      />
                    </div>
                    <div className="w-full px-6 pt-2">
                      <label className="text-lg">Total Experience</label>
                      <label className="text-red-500 pl-1">*</label>

                      <input
                        type="text"
                        className="block border p-2 rounded w-full "
                        placeholder="Total Experience"
                        onChange={(e) => setTotalExp(e.target.value)}
                        required
                      />
                    </div>
                    
                  </div>

                  <div className="flex flex-cols ">
                  <div className="w-1/2 px-6">
                    <label className="text-lg">University Name</label>
                    <label className="text-red-500 pl-1">*</label>
                    <input
                      type={"text"}
                      className="block border p-2 rounded w-full "
                      onChange={(e) => setUniversityName(e.target.value)}
                      placeholder="University name"
                      required
                    />
                  </div>
                  <div className="w-1/2 px-6">
                    <label className="text-lg">University Graduation Year</label>
                    <label className="text-red-500 pl-1">*</label>
                    <input
                      type="number"
                      className="block border p-2 rounded w-full "
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="Graduation Year"
                      required
                    />
                  </div>
                 
                 

                  </div>

                 

                 
                </div>
                <div className="flex flex-cols ">
                <div className="w-1/2 px-6">
                    <label className="text-lg">Key Skills</label>
                    <label className="text-red-500 pl-1">*</label>
                    <input
                      type={"text"}
                      className="block border p-2 rounded w-full "
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Key Skills"
                      required
                    />
                  </div>
                  <div className="w-1/2 px-6">
                    <label className="text-lg">Resume Headline</label>
                    <label className="text-red-500 pl-1">*</label>
                    <input
                      type={"text"}
                      className="block border p-2 rounded w-full "
                      onChange={(e) => setResumeHeadline(e.target.value)}
                      placeholder="Resume Headline"
                      required
                    />
                  </div>
                  
                 

                  </div>
              </div>

              <div className="flex flex-cols ">
              <div className="w-full px-6 pt-2">

<label className="text-lg">Resume link</label>
<label className="text-red-500 pl-1">*</label>
<input
className="block border p-2 rounded w-full "
onChange={(e) => setResumeLink(e.target.value)}
required
></input>

</div>

<div className="w-full px-6 pt-2">
      <label className="text-lg">Candidate Source</label>
      <label className="text-red-500 pl-1">*</label>
      <Select
        options={candidateSources}
        onChange={(selectedOption)=>setCandidateSource(selectedOption)}
        isClearable
        required
        className="mt-2"
      />
    </div>

            

              </div>
              <div className="w-1/2 px-6">

<label className="text-lg">Resume Summary</label>
<label className="text-red-500 pl-1">*</label>
<textarea
className="block border p-2 rounded w-full "
onChange={(e) => setResumeSummary(e.target.value)}
required
></textarea>

</div>
              
           
              <div className=" col-span-3 mt-4">
                <hr />
              </div>
              <div className="my-2">
                {!showLoading ? (
                  <button
                    type="submit"
                    className="px-6 text-white font-semibold rounded py-2 bg-[#103f59] "
                  >
                    Save
                  </button>
                ) : (
                  <button disabled={showLoading} className=" px-6 flex items-center text-white font-semibold rounded py-2 bg-[#103f59] ">
                    <div
                      class="w-4 h-4 rounded-full animate-spin
                    border-2 border-solid border-white mr-2 border-t-transparent"
                    ></div>
                    Please Wait..
                  </button>
                )}
              </div>
            </div>
          </form>
        </AccordionLayout>
      </div>
    </div>
  );
};

export const AccordionLayout = ({
  title,
  children,
  index,
  activeIndex,
  setActiveIndex,
}) => {
  const handleSetIndex = (index) =>
    activeIndex !== index && setActiveIndex(index);
  return (
    <>
      <div
        onClick={() => handleSetIndex(index)}
        className="overflow-y-auto max-h-[calc(100vh-50px)] flex w-full items-center justify-between p-2 mt-2 rounded bg-primary"
      >
        <div className="flex">
          <div className="text-white font-bold">{title}</div>
        </div>
        <div className="flex items-center justify-center ">
          {activeIndex === index ? (
            <BsFillArrowDownCircleFill
              fill="white"
              className="w-4 h-4 text-white "
            />
          ) : (
            <BsFillArrowUpCircleFill
              className="w-4 h-4 text-white"
              fill="white"
            />
          )}
        </div>
      </div>

      {activeIndex === index && (
        <div className="shadow-3xl rounded-2xl shadow-cyan-500/50 p-4 mb-6">
          {children}
        </div>
      )}
    </>
  );
};

export default AddAssignee;
