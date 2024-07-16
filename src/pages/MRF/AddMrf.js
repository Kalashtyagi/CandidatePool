import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router";
import { useLocation } from "react-router";
import BackButton from "../../components/BackButton";


const datatoken = localStorage.getItem("data");
const jsonData = JSON.parse(datatoken);
const accessToken = jsonData?.access_token;
const authorize = "Bearer" + " " + accessToken;

const AddMrf = ({ data, erfId, recruitmentType }) => {
  const location=useLocation();
  const{id,recruitment_type}=location.state||{}
  console.log("id",recruitment_type)
  useEffect(() => {
    document.title = "CIPLCRM | AddMRF";
  }, []);
  
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState([]);
  const [address, setAddress] = useState("");
  const [otherSkills, setOtherSkills] = useState("");
  const [certification, setCertification] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [designation, setDesignation] = useState("");
  const [level, setLevel] = useState("L0");
  const [projectManager, setProjectManager] = useState("");
  const [reportingTeam, setReportingTeam] = useState("");
  const [positions, setPositions] = useState("");
  const [budget, setBudget] = useState(0);
  const [graduation, setGraduation] = useState("");
  const [additionalQualification, setAdditionalQualification] = useState("");
  const [file, setFile] = useState();
  const [totalExperience, setTotalExperience] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [keyResponsibility, setKeyResponsibility] = useState("");
  const [essentialSkills, setEssentialSkills] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const[pidOptions,setPidOptions] = useState([]);
  const[loading,setLoading] = useState(false);
  const[MrfId,setMrfId]=useState('')
  const replacementPredata = {
    employeeName: "",
    employeeCode: "",
    employeeResgDate: "",
    employeeLastDate: "",
  };
  const [replacementData, setReplacementData] = useState([replacementPredata]);

  const multipleQualifcationData = {
    qualificationId: "",
    subQualificationId: "",
    subQualificationList: [{ label: "Please select qualification", value: "" }],
  };
  const [multipleQualification, setMultipleQualification] = useState([
    multipleQualifcationData,
  ]);
  const [datajd, setDataJd] = useState([]);

  // api data state handling
  const [categoryList, setCategoryList] = useState("");
  const [certificationList, setCertificationList] = useState("");
  // const [departmentList, setDepartmentList] = useState('')
  const [qualificationList, setQualificationList] = useState("");
  const [subQualificationList, setSubQualificationList] = useState([
    { label: "Please select qualification", value: "" },
  ]);
  const [skillsList, setSkillsList] = useState("");
  const[titleData,setTitleData]=useState([])
  const[title,setTitle]=useState('')
  const[allHodData,setAllHodData]=useState([])
  const[allProjectLead,setAllProjectLead]=useState([]);
  const[ishod,setIsHod]=useState();
  const[isprojectlead,setIsProjectLead]=useState();

  // local data
  const jsonData = JSON.parse(localStorage.getItem("data"));
  const accessToken = jsonData && jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;

  console.log(jobDescription);

  useEffect(() => {
    document.title = "CIPLCRM | Job Description";

    axios
      .get(
        `${process.env.REACT_APP_API_URL}jd`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authorize}`,
          },
        }
      )
      .then((res) => {
        setDataJd(res.data.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setAddress(
        data?.address === null || undefined || "" ? "" : data?.address
      );
      setDesignation(
        data?.degination === null || undefined || "" ? "" : data?.degination
      );
      setLevel(data?.level === null || undefined || "" ? "" : data?.level);
      setCategory(
        data?.category?.id === null || undefined || "" ? "" : data?.category?.id
      );
      setSkill(
        data?.skills.length > 0
          ? data?.skills.map((x) => ({
              label: x?.skill?.name,
              value: x?.skill?.value,
            }))
          : ""
      );
      setBudget(
        data?.position_budgeted === null || undefined || ""
          ? ""
          : data?.position_budgeted
      );
      setPositions(
        data?.total_positions === null || undefined || ""
          ? ""
          : data?.total_positions
      );
      setReportingTeam(
        data?.reporting_team === null || undefined || ""
          ? ""
          : data?.reporting_team
      );
      setProjectManager(
        data?.project_manager === null || undefined || ""
          ? ""
          : data?.project_manager
      );
      setJobDescription(
        data?.job_description === null || undefined || ""
          ? ""
          : data?.job_descriptions
      );
      setGraduation(
        data?.qualification === null || undefined || ""
          ? ""
          : data?.qualification
      );
      setAdditionalQualification(
        data?.subqualifications.length > 0
          ? data?.subqualifications.map((x) => ({
              label: x?.subqualification?.name,
              value: x?.subqualification?.value,
            }))
          : ""
      );
      setCertification(
        data?.anycertification !== null || undefined || ""
          ? [
              {
                label: data?.anycertification?.name,
                value: data?.anycertification?.value,
              },
            ]
          : ""
      );
      setRelevantExperience(
        data?.relevent_exp === null || undefined || "" ? "" : data?.relevent_exp
      );
      setKeyResponsibility(
        data?.responsibility === null || undefined || ""
          ? ""
          : data?.responsibility
      );
      setPrerequisites(
        data?.prerequisite === null || undefined || "" ? "" : data?.prerequisite
      );
      // setTotalExperience(data?.)
    }
  }, [data]);
  const handleFileChange = (e) =>{
    const selectedFile = e.target.files[0];
    const validFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf'
    ];
    if (selectedFile && !validFileTypes.includes(selectedFile.type)) {
      toast.warn('Unsupported file type. Please upload a JPEG, JPG, PNG, DOC, DOCX, RTF, XLS, XLSX, or PDF file.');
      e.target.value = null; 
    } else {
      setFile(selectedFile);
    }
  }

  // custom functions
  const preventPasteNegative = (e) => {
    const clipboardData = e.clipboardData || window.Clipboard;
    const pastedData = parseFloat(clipboardData.getData("text"));

    if (pastedData < 0) {
      e.preventDefault();
    }
  };

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };
 
  
  const getAllHod=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}team/ishod`,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`${authorize}`
        }
      })
      if(response?.status===200){
        const data=await response?.data?.data;
        setAllHodData(data);
      }

    }catch(error){
      console.log(error);
    }
  }
  const getAllProjectLead=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}team/isprojectlead`,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`${authorize}`
        }
      })
      if(response?.status===200){
        const data=await response?.data?.data;
        setAllProjectLead(data);
      }

    }catch(error){
      console.log(error);
    }
  }
  useEffect(()=>{
     getAllHod();
     getAllProjectLead();
  },[])


  const handleProjectLeadChange = (selectedOption) => {
    setIsProjectLead(selectedOption ? selectedOption.value : null);
  };
  const handleHodChange=(selectedOption)=>{
    setIsHod(selectedOption ? selectedOption.value : null)
  }

  const options = allProjectLead?.map((skills) => ({
    value: skills?.id,
    label: skills?.name,
  }));
  const options1 = allHodData?.map((skills) => ({
    value: skills?.id,
    label: skills?.name,
  }));
  console.log("hod",allHodData)
  console.log("project",allProjectLead)
 
  // call api
  const skillsListApi = async () => {
    try{
      if (!category) {
        setSkillsList({ data: [] });
        return;
      }
      const requestSkills = await axios.get(
        `${process.env.REACT_APP_API_URL}skill/search/${category}`,
        {
          headers: {
            Authorization: `${authorize}`,
          },
        }
      );
      const skillsResponse = await requestSkills.data;
    
      if (skillsResponse?.data.length > 0) {
        setSkillsList(skillsResponse);
      } else {
        setSkillsList({ data: [] });
      }
    }catch(error){
      console.log(error);
    }
    
  };

  
  const categoriesListApi = async () => {
    const requestCategory = await axios.get(
      `${process.env.REACT_APP_API_URL}jobcategories`,
      {
        headers: {
          Authorization: `${authorize}`,
        },
      }
    );
    const categoryResponse = await requestCategory?.data;
    // console.log('Categories', categoryResponse)
    if (categoryResponse?.data.length > 0) {
      setCategoryList(categoryResponse);
    }
  };

  const certificaitonListApi = async () => {
    const requestCertification = await axios.get(
      `${process.env.REACT_APP_API_URL}certification`,
      {
        headers: {
          Authorization: `${authorize}`,
        },
      }
    );
    const certificationResponse = await requestCertification?.data;
    // console.log('certification', certificationResponse)
    if (certificationResponse?.data.length > 0) {
      setCertificationList(
        certificationResponse?.data?.map((x) => ({
          value: x?.id,
          label: x?.name,
        }))
      );
    }
  };

  const getQualificationApi = async () => {
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
  };

  const getSubQualifications = async ({ graduationId, index }) => {
    // console.log("graduationid", graduationId);
    const getSubQualification = await fetch(
      `${process.env.REACT_APP_API_URL}subqualification/search`,
      {
        method: "POST",
        headers: {
          Authorization: `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          qualification_id: `${graduationId}`,
        }),
      }
    );
    const jsonResponse = await getSubQualification?.json();
    // console.log("Sub Qualification",jsonResponse )

    if (jsonResponse?.data) {
      // console.log('response',jsonResponse?.data)
      const subqualificationsList = jsonResponse?.data?.map((x) => ({
        label: x?.name,
        value: x?.id,
      }));
      let data = [...multipleQualification];
      data[index].subQualificationList = subqualificationsList;
      setMultipleQualification(data);
    } else {
      let newData = [...multipleQualification];
      newData[index].subQualificationList = [
        { value: "", label: "Please Select qualification..!" },
      ];
      setMultipleQualification(newData);
    }
  };

  const handleMore = (e) => {
    e.preventDefault();
    let newData = {
      employeeName: "",
      employeeCode: "",
      employeeResgDate: "",
      employeeLastDate: "",
    };
    setReplacementData([...replacementData, newData]);
  };

  const handleChange = (e, index) => {
    let handleChangeData = [...replacementData];
    handleChangeData[index][e.target.name] = e.target.value;
    setReplacementData(handleChangeData);
  };

  // console.log('reaplcememtn data', replacementData)

  const handleDelete = (e, index) => {
    // console.log('index',index)
    e.preventDefault();
    let handleDeleteData = [...replacementData];
    handleDeleteData.splice(index);
    setReplacementData(handleDeleteData);
  };
  
const getAllTitle=async()=>{
  try{
    const response = await axios.get(`${process.env.REACT_APP_API_URL}project-titles`,{
      headers:{
        "Content-Type":"application/json",
        'Authorization':`${authorize}`,
      },
    })
    console.log("repidjij",response)
    if(response?.status===200){
      const apiData=response?.data?.data
      setTitleData(apiData)
    }    
  }catch(error){
    console.log(error);
  }
}

console.log("titleData",titleData)
  useEffect(() => {
    categoriesListApi();
    getQualificationApi();
    certificaitonListApi();
    getAllTitle()
  }, []);

  useEffect(() => {
    skillsListApi();
  }, [category]);

  const handleQualificationChange = (e, index) => {
    const { value } = e.target;
    // console.log('value',value)
    let newData = [...multipleQualification];
    newData[index].qualificationId = value;
    setMultipleQualification(newData);
    if (value) {
      getSubQualifications({ graduationId: value, index });
    } else {
      newData[index].subQualificationList = [
        { value: "", label: "Please Select qualification..!" },
      ];
      setMultipleQualification(newData);
    }
  };

  const handleDeleteQualification = (index) => {
    let newData = [...multipleQualification];
    newData.splice(index, 1);
    setMultipleQualification(newData);
  };

  const handleAddQualification = (e) => {
    let newData = {
      qualificationId: "",
      subQualificationId: "",
    };
    setMultipleQualification([...multipleQualification, newData]);
  };

  const qualificationLists =
    multipleQualification &&
    multipleQualification?.map((x) => x?.qualificationId);
  const subqualificationLists =
    multipleQualification &&
    multipleQualification?.map((x) => x?.subQualificationId);
 
  const levelList = ["L0", "L1", "L2", "L3", "L4", "L5"];


   
  const postMrfData=async()=>{ 
    try {
      setLoading(true)
   const formdata = new FormData();
   let flattenedArray = subqualificationLists.flat();
   formdata.append("jd_id", `${jobDescription}`);
   formdata.append("total_positions", `${positions}`);
   formdata.append("location", `${address}`);
   formdata.append("user_id",jsonData?.data?.id)
   formdata.append("category_id", `${category}`);
   formdata.append("degination", `${designation}`);
   formdata.append("level", `${level}`);
   formdata.append("project_manager", `${isprojectlead}`);
   formdata.append("reporting_team", `${ishod}`);
   formdata.append("title_id",`${titleId}`)
   formdata.append("position_budgeted", `${budget}`);
   formdata.append("total_experience", `${totalExperience}`);
   formdata.append("relevent_exp", `${relevantExperience}`);
   formdata.append("responsibility", `${keyResponsibility}`);
   formdata.append("end_date", `${startDate}`);
   formdata.append("recruitment_type",recruitment_type)
   formdata.append("start_date", `${endDate}`);
   formdata.append("M_id",`${MrfId}`)
   formdata.append("prerequisite", `${prerequisites}`);
   formdata.append("anycertification_id",certification)
   formdata.append(
     "employee[0][emp_name]",
     `${
       replacementData[0]?.employeeName
         ? replacementData[0]?.employeeName
         : "null"
     }`
   );
   formdata.append(
     "employee[0][emp_code]",
     `${
       replacementData[0]?.employeeCode
         ? replacementData[0]?.employeeCode
         : "null"
     }`
   );
   formdata.append(
     "employee[0][last_working_date]",
     `${
       replacementData[0]?.employeeLastDate
         ? replacementData[0]?.employeeLastDate
         : "null"
     }`
   );
   formdata.append(
     "employee[0][resign_date]",
     `${
       replacementData[0]?.employeeResgDate
         ? replacementData[0]?.employeeResgDate
         : "null"
     }`
   );
   for (let i = 0; i < qualificationLists.length; i++) {
     formdata.append(`qualification[${i}]`, qualificationLists[i]);
   }
   for (let i = 0; i < flattenedArray.length; i++) {
     formdata.append(
       `additionalqualification[${i}]`,
       `${flattenedArray[i]}`
     );
   }
  
   formdata.append("scopeofwork", file);
   for (let i = 0; i < skill.length; i++) {
     formdata.append(`skill_id[${i}]`, `${skill[i]}`);
   }
   const request = await axios.postForm(
     `${process.env.REACT_APP_API_URL}jobs/erf/${id??''}`,
     formdata,
     {
       headers: {
         Authorization: `Bearer ${accessToken}`,
         Accept: "application/json",
       },
     }
   );
   console.log("requeset",request)
   if(request?.status==200){
    const data=request?.data?.message
    console.log(data)
    toast.success("Mrf Create Successfully");
    setTimeout(() => {
      navigate('/admin/mrf')

    },2000);

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
 finally{
  setLoading(false);
 }


 }
let titleId;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(title===""){
      toast.error("plz select title");
      return;
    }
    const find=titleData && titleData?.find((item)=>item.title==title)
    console.log("find",find)
    if(!find){
      try{
        setLoading(true);
        const response=await axios.post(`${process.env.REACT_APP_API_URL}project-titles`,{title:title},{
          headers:{
            "Content-Type":"applicaton/json",
            "Authorization":`${authorize}`
          }
        })
        if(response?.status===200){
          titleId=response?.data?.data?.id;
          setTimeout(() => {
            postMrfData();
          }, 1500);
        }
        console.log("responseeeee",response)

      }catch(error){
        console.log(error);

      }                                                                                             
      finally{
        setLoading(false)
      }
    }
    else{
      titleId=find?.id;
      postMrfData();
    }
   
   
  };

  return (
  <>
   
    <div className="min-h-screen bg-gray-50 p-4 bg-gradient-to-r from-blue-100 to-blue-200">
      <ToastContainer position="top-right"/>

   <BackButton route={-1}/>
     
        <div className="flex rounded bg-gradient-to-r from-blue-100 to-blue-200-200 p-2">
            <h2 className="font-semibold text-2xl text-left">
              Add MRF
            </h2>
          </div>
           
        
      <form onSubmit={handleSubmit} className="max-w-full mx-auto px-4 py-8">
      <div className=" py-4 overflow-y-auto max-h-[calc(100vh-150px)] scrollbar-custom">

        <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                MrfId
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              type="text"
              value={MrfId}
              onChange={(e) => setMrfId(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
       
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Location
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Requisition Date
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
               required
               name="startDate"
               placeholder="Requisition Date"
               onChange={(e) => setStartDate(e.target.value)}
               type="date"
              className="border px-2 w-full py-2 rounded-md"
              
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Target Date
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              required
              placeholder="Target Date"
              name="endDate"
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="border px-2 w-full py-2 rounded-md"
              
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Designation
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Level
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <select
                    required
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                     className="border px-2 w-full py-2 rounded-md"
                  >
                    {levelList.map((list, index) => (
                      <option value={list} key={index}>
                        {list}
                      </option>
                    ))}
                  </select>
           
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Title
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Job Category
              </label>
            </div>
            <select
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border px-2 w-full py-2 rounded-md"
                  >
                    <option>Choose Category</option>
                    {categoryList?.data &&
                      categoryList?.data?.map((options) => {
                        return (
                          <option key={options?.id} value={options?.id}>
                            {options?.name}
                          </option>
                        );
                      })}
                  </select>
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Skills
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
              
              <Select
                    // value={skill}
                    options={category? skillsList?.data?.map((skills) => ({
                      value: skills?.id,
                      label: skills?.name,
                    })):[{value:'',label:'Please select job category'}]}
                    // getOptionValue={(option)=>option?.value}
                    onChange={(e) => setSkill(e.map((x) => x.value))}
                    isMulti={true}
                    isClearable
                    isDisabled={!category}
                    placeholder={category?"Select Skills":"Please select job category"}
                  />
            </div>
            {skill === "Other" ? (
                  <div className=" col-span-4 md:px-2 md:pr-2 md:py-0 py-1 ">
                    <div className=" text-left md:py-2">
                      <label className="text-md text-left font-semibold ">
                        Other Skiils
                      </label>
                      <span className="text-red-500 text-md font-semibold px-1">
                        *
                      </span>
                    </div>
                    <input
                      type="text"
                      value={otherSkills}
                      onChange={(e) => setOtherSkills(e.target.value)}
                      className="border px-2 w-full py-[9px] rounded-md"
                      required={skill === "Other" ? true : false}
                    />
                  </div>
                ) : null}
            
            
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Hiring Budget
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
                    type="number"
                    min="0"
                    value={budget}
                    onPaste={preventPasteNegative}
                    onKeyDown={preventMinus}
                    onChange={(e) => setBudget(e.target.value)}
                   className="border px-2 w-full py-2 rounded-md"
                    required
                  />
           
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                No. of Positions
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
                    required
                    value={positions}
                    min="0"
                    onPaste={preventPasteNegative}
                    onKeyDown={preventMinus}
                    type="number"
                   className="border px-2 w-full py-2 rounded-md"
                    onChange={(e) => setPositions(e.target.value)}
                  />
           
          </div>
          <div className=" col-span-6  md:pr-2 md:py-0 py-1">
                  <div className=" text-left md:py-2 ">
                    <label className="text-md text-left font-semibold ">
                      Reporting to (Hod)
                    </label>
                    <span className="text-red-500 text-md font-semibold px-1">
                      *
                    </span>
                  </div>
                  <Select
                   value={options1.find(option => option.value === ishod)}
                   options={options}
                   onChange={handleHodChange}
                   isClearable
                    
                  />
                
                </div>
                <div className=" col-span-6 md:pr-2 md:py-0 py-1">
                  <div className="text-left md:py-2">
                    <label className="text-md text-left font-semibold">
                      Project Manager
                    </label>
                    <span className="text-red-500 text-md font-semibold px-1">
                      *
                    </span>
                  </div>
                  <Select
                   value={options.find(option => option.value === isprojectlead)}
                   options={options}
                   onChange={handleProjectLeadChange}
                   isClearable
                  
                  />

                  
                </div>
                <div className=" col-span-12 pr-2 text-left  md:py-0 py-1">
                  <div className=" text-left md:py-2">
                    <label className="text-md text-left font-semibold pb-2 ">
                      Job Description
                    </label>
                   
                      <span className="text-red-500 text-md font-semibold px-1">
                        *
                      </span>

                    <Select
                      className="mt-2"
                      // value={skill}
                      options={datajd?.map((ele) => ({
                        value: ele?.id,
                        label: ele?.designation,
                      }))}
                      onChange={(selectedOption) =>
                        setJobDescription(selectedOption?.value)
                      }
                      isMulti={false}
                      isClearable
                    />
                  </div>
                </div>
        </div>

        <div className="my-2 col-span-12 mt-2">
          <div className="flex rounded bg-gradient-to-r from-blue-100 to-blue-200 p-2">
            <h2 className="font-semibold text-2xl text-left">
              Education Details:
            </h2>
          </div>
          {multipleQualification.length > 0 &&
            multipleQualification.map((qualification, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <div className="text-left py-2">
                    <label className="text-md font-semibold">
                      Highest Qualification
                      <span className="text-red-500 text-md font-semibold px-1">*</span>
                    </label>
                  </div>
                  <select
                    onChange={(e) => handleQualificationChange(e, index)}
                    className="border px-2 w-full py-2 rounded-md"
                    required
                  >
                   <option>Choose Qualification</option>
                              {qualificationList &&
                                qualificationList?.map((qualification) => (
                                  <option
                                    key={qualification?.id}
                                    value={qualification?.id}
                                  >
                                    {qualification?.name}
                                  </option>
                                ))}
                  </select>
                </div>
                <div className="col-span-6">
                  <div className="text-left py-2">
                    <label className="text-md font-semibold">
                      Specialization
                      <span className="text-red-500 text-md font-semibold px-1">*</span>
                    </label>
                  </div>
                  <Select
                              required
                              options={
                                multipleQualification[index]
                                  ?.subQualificationList?.length > 0
                                  ? multipleQualification[index]
                                      ?.subQualificationList
                                  : [
                                      {
                                        value: "",
                                        label: "Please select qualification.!",
                                      },
                                    ]
                              }
                              onChange={(e) => {
                                let newData = [...multipleQualification];
                                newData[index].subQualificationId = e.map(
                                  (x) => x.value
                                );
                                setMultipleQualification(newData);
                              }}
                              isMulti={true}
                              isClearable
                            />
                  
                </div>
               
              </div>
            ))}
        </div>
        

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Add Scope of Work
              </label>
            </div>
            <input
              type="file"
              accept=".jpeg,.jpg,.png,.doc,.docx,.rtf,.xls,.xlsx,.pdf"
              onChange={handleFileChange}
              className="border px-2 w-full py-2 rounded-md"
            />
            <div className="text-left py-2">
              <label className="text-sm">
                We accept JPEG, JPG, PNG, DOC, DOCX, RTF, XLS, XLSX and PDF files
              </label>
            </div>
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Certification
              </label>
            </div>
            <Select
                      value={certification}
                      options={
                        certificationList?.length > 0
                          ? certificationList
                          : [{ value: "", label: "Please Wait..!" }]
                      }
                      onChange={(e) =>
                        setCertification(e?.map((x) => x?.value))
                      }
                      isMulti={true}
                      isClearable
                    />
          </div>
        </div>

        <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded mt-4">
          <h2 className="font-semibold text-2xl text-left">
            Experience Details:
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Total Experience (Years)
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
               type="text"
              //  min="0"
               value={totalExperience}
               onPaste={preventPasteNegative}
               onKeyDown={preventMinus}
               onChange={(e) => setTotalExperience(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Relevant Experience (Years)
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              type="text"
              // min="0"
              value={relevantExperience}
              onPaste={preventPasteNegative}
              onKeyDown={preventMinus}
              onChange={(e) => setRelevantExperience(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
          <div className="col-span-6">
            <div className="text-left py-2">
              <label className="text-md font-semibold">
                Key Responsibility Areas
                <span className="text-red-500 text-md font-semibold px-1">*</span>
              </label>
            </div>
            <input
              type="text"
              value={keyResponsibility}
              onChange={(e) => setKeyResponsibility(e.target.value)}
              className="border px-2 w-full py-2 rounded-md"
              required
            />
          </div>
          <div className="col-span-6 md:pr-2 md:py-0 py-1">
                    <div className="text-left md:py-2">
                      <label className="text-md text-left font-semibold">
                        Essential Skills (Technical)
                      </label>
                    </div>
                    <input
                      type="text"
                      className="border px-2 w-full py-[9px] rounded-md"
                      onChange={(e) => setEssentialSkills(e.target.value)}
                      // required
                    />
                  </div>
          <div className="col-span-7 md:px-2 md:py-0 py-1">
                    <div className=" text-left md:py-2">
                      <label className="text-md text-left font-semibold ">
                        Prerequisites for the employee (This section will
                        involve the instruments/ tools required by the
                        employee/s at the time of joining):{" "}
                      </label>
                    </div>
                    <input
                      value={prerequisites}
                      onChange={(e) => setPrerequisites(e.target.value)}
                      className="border text-sm font-medium px-2 py-[9px] w-full rounded-md"
                    />
                  </div>
        </div>

        <div className="flex justify-end py-3 px-2 border-t">
          <button
          disabled={loading}
            type="submit"
            className=" w-40 bg-[#103f59] text-white active:bg-[#103f59] font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
            
          >
            {loading? <i className="fas fa-spinner fa-spin mr-2"></i>:"Save"}
          </button>
        </div>
        </div>

    
      </form>
    </div>

    </>
  );
};

export default AddMrf;