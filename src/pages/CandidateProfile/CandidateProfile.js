import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { Circles } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import BackButton from '../../components/BackButton';
import { hasPermission } from '../../components/HasPermission';
import { getAllMrf } from '../../Services/ProjectSevices';

const CandidateProfile = () => {
    const [candidateData, setCandidateData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [assignMrfButton,setAssignMrfButton] = useState(false);
    const[allMrf,setAllMrf] = useState([]);
    const[MrfId,setMrfId] = useState("");
    const { state } = useLocation();
    const data = JSON.parse(localStorage.getItem('data'));
    const accessToken = data?.access_token;
    const authorize = "Bearer" + " " + accessToken;

    const params = useParams();
    const candidateId = params.Id;

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchMrf = async () =>{
            try{
                const res = await getAllMrf();
                if(res){
                    setAllMrf(res);
                }
    
            }
        catch(error){
            console.log(error);
        }}
  
        fetchMrf();
    },[])
    const getCandidateById = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}candidates/${candidateId}`, {
                headers: {
                    'Authorization': `${authorize}`
                }
            });
            setCandidateData(response?.data?.data[0]);
        } catch (error) {
            console.error("Error fetching candidate data:", error);
            toast.error(error?.response?.data?.message || 'Failed to fetch candidate data');
        } finally {
            setLoading(false);
        }
    };
    console.log("cc",candidateData)

    useEffect(() => {
        getCandidateById();
    }, [candidateId]);

    const handleEditButtonClick = () => {
        setIsEditing(true);
    };

    const handleUpdateButtonClick = async (event) => {
        event.preventDefault();
        const updatedData = new FormData(event.target);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}candidates/update/${candidateId}`, updatedData, {
                headers: {
                    'Authorization': `${authorize}`
                }
            });
            getCandidateById();
            setIsEditing(false);
            toast.success(response?.data?.message);
        } catch (error) {
            console.error("Error updating candidate data:", error);
            toast.error(error?.response?.data?.message || 'Failed to update candidate data');
        }
    };

    const handleAssignMrf = async (event) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}candidates/update/${candidateId}`, {MRFId:MrfId}, {
                headers: {
                    'Authorization': `${authorize}`
                }
            });
            console.log("response",response)
            getCandidateById();
            setIsEditing(false);
            toast.success(response?.data?.message);
        } catch (error) {
            console.error("Error updating candidate data:", error);
            toast.error(error?.response?.data?.message || 'Failed to update candidate data');
        }
    };

    const toggleAccordion = (index) => {
        setExpandedAccordion(index === expandedAccordion ? -1 : index);
    };

    const handleAssign = () =>{
        setAssignMrfButton(true);
    }
    return (
        <div className="relative p-8 overflow-y-auto max-h-[calc(130vh-250px)] scrollbar-custom" style={{ backgroundColor: "white" }}>
            <ToastContainer autoClose={3000} position="top-right" />
            <BackButton route={-1}/> 
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Circles color="#00BFFF" height={80} width={80} />
                </div>
            ) : (
                candidateData && (
                    <div className="flex justify-between items-start">
                        <div className="w-3/4">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold">{candidateData?.Name}</h1>
                               
                                {hasPermission("edit_candidate") && (
                                    <div className='flex gap-5'>
                                      <button
                                     className="bg-[#103f59] text-white px-4 py-2 rounded-md flex items-center"
                                     onClick={handleEditButtonClick}
                                 >
                                     <FaEdit className="mr-2" /> Edit
                                 </button>
                                 {candidateData?.MRFID==null && 
                                  <button
                                  className="bg-[#103f59] text-white px-4 py-2 rounded-md flex items-center"
                                  onClick={assignMrfButton==false?handleAssign:handleAssignMrf}
                              >
                                  <FaEdit className="mr-2" /> {assignMrfButton==false?"Assign Mrf":"Save Mrf"}
                              </button>
                                 }
                                    </div>

                                )}
                            </div>
                            {assignMrfButton && (
                                     <div className="mb-4">
                                      <select
                                      required
                                    typeof='text'
                                    value={MrfId}
                                    onChange={(e)=>setMrfId(e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8 bg-gray-200"
                                    >
                                      <option value="">Choose MRF</option>
                                     {allMrf && allMrf.map((options)=>{
                                       return(
                                         <option key={options?.id} value={options?.id}>
                                           {options?.M_id}
                                         </option>
                                       )
                                     })}
                                    </select>
                                   </div>
                                )}
                            <form onSubmit={handleUpdateButtonClick}>
                                <div className="space-y-4">
                                    <Accordion
                                        title="Personal Information"
                                        fields={[

                                            { label: "Name", name: "Name", value: candidateData?.Name },
                                            { label: "Email", name: "EmailId", value: candidateData?.EmailId },
                                            { label: "Phone Number", name: "PhoneNumber", value: candidateData?.PhoneNumber },
                                            { label: "Current Location", name: "CurrentLocation", value: candidateData?.CurrentLocation },
                                            { label: "Preferred Locations", name: "PreferredLocations", value: candidateData?.PreferredLocations },
                                            { label: "Date of Application", name: "DateOfApplication", value: candidateData?.DateOfApplication },
                                            { label: "Date Of Birth", name: "DateOfBirth", value: candidateData?.DateOfBirth },
                                            { label: "Gender", name: "Gender", value: candidateData?.Gender },
                                            { label: "Marital Status", name: "MaritalStatus", value: candidateData?.MaritalStatus }
                                        ]}
                                        isEditing={isEditing}
                                        expandedAccordion={expandedAccordion}
                                        index={0}
                                        toggleAccordion={toggleAccordion}
                                    />
                                    <Accordion
                                        title="Qualification"
                                        fields={[
                                            { label: "Undergraduate Degree", name: "UnderGraduationDegree", value: candidateData?.UnderGraduationDegree },
                                            { label: "UG Specialization", name: "UGSpecialization", value: candidateData?.UGSpecialization },
                                            { label: "UG University", name: "UGUniversityName", value: candidateData?.UGUniversityName },
                                            { label: "UG Graduation Year", name: "UGGraduationYear", value: candidateData?.UGGraduationYear },
                                            { label: "Postgraduate Degree", name: "PostGraduationDegree", value: candidateData?.PostGraduationDegree },
                                            { label: "PG Specialization", name: "PGSpecialization", value: candidateData?.PGSpecialization },
                                            { label: "PG University", name: "PGUniversityName", value: candidateData?.PGUniversityName },
                                            { label: "PG Graduation Year", name: "PGGraduationYear", value: candidateData?.PGGraduationYear },
                                            { label: "Doctorate Degree", name: "DoctorateDegree", value: candidateData?.DoctorateDegree },
                                            { label: "Doctorate Specialization", name: "DoctorateSpecialization", value: candidateData?.DoctorateSpecialization },
                                            { label: "Doctorate University", name: "DoctorateUniversityName", value: candidateData?.DoctorateUniversityName },
                                            { label: "Doctorate Graduation Year", name: "DoctorateGraduationYear", value: candidateData?.DoctorateGraduationYear }
                                        ]}
                                        isEditing={isEditing}
                                        expandedAccordion={expandedAccordion}
                                        index={1}
                                        toggleAccordion={toggleAccordion}
                                    />
                                    <Accordion
                                        title="Experience"
                                        fields={[
                                            { label: "Total Experience", name: "TotalExperience", value: candidateData?.TotalExperience ? `${candidateData?.TotalExperience} years` : 'N/A' },
                                            { label: "Current Company", name: "CurrentCompanyName", value: candidateData?.CurrentCompanyName },
                                            { label: "Designation", name: "CurrentCompanyDesignation", value: candidateData?.CurrentCompanyDesignation },
                                            { label: "Department", name: "Department", value: candidateData?.Department },
                                            { label: "Role", name: "Role", value: candidateData?.Role },
                                            { label: "Industry", name: "Industry", value: candidateData?.Industry },
                                            { label: "Key Skills", name: "KeySkills", value: candidateData?.KeySkills },
                                            { label: "Annual Salary", name: "AnnualSalary", value: candidateData?.AnnualSalary },
                                            { label: "Notice Period", name: "NoticePeriod", value: candidateData?.NoticePeriod },
                                            { label: "Resume Headline", name: "ResumeHeadline", value: candidateData?.ResumeHeadline },
                                            { label: "Resume Link", name: "ResumeLink", value: candidateData?.ResumeLink },
                                           
                                        ]}
                                        isEditing={isEditing}
                                        expandedAccordion={expandedAccordion}
                                        index={2}
                                        toggleAccordion={toggleAccordion}
                                    />
                                </div>
                                {isEditing && (
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-[#103f59] text-white px-4 py-2 rounded-md mt-4"
                                        >
                                            Update
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="w-1/4 sticky top-14 ml-10">
                            <h2 className="text-xl font-bold mb-4">Candidate History</h2>
                            <div className="space-y-4">
                                <ul className="space-y-4">
                                    {candidateData?.CandidateStatuses && candidateData.CandidateStatuses.map((status, index) => (
                                        <li key={index} className="flex items-center">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-green-500`}>
                                                <FaCheckCircle />
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-semibold">{status.Status}</p>
                                                <p className="text-sm text-gray-500">{new Date(status.CreatedAt).toLocaleString()}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

const Accordion = ({ title, fields, isEditing, expandedAccordion, index, toggleAccordion }) => {
    return (


        <div className="border border-gray-300 rounded-md">
            <div
                className="cursor-pointer flex justify-between items-center p-4 border-b border-gray-300"
                onClick={() => toggleAccordion(index)}
            >
                <h3 className="text-lg font-semibold">{title}</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform transform ${expandedAccordion === index ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a1 1 0 01-.707-.293l-8-8a1 1 0 111.414-1.414L10 15.586l7.293-7.293a1 1 0 111.414 1.414l-8 8A1 1 0 0110 18z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            {expandedAccordion === index && (
                <div className="grid grid-cols-3 gap-4 p-4">
                    {fields.map((field, index) => (
                        <div key={index} className="mb-4">
                            {isEditing ? (
                                <div className="relative">
                                    <input
                                        type={((field.label === "Date Of Birth") || (field.label === "Date of Application")) ? "date" : "text"}
                                        name={field.name}
                                        defaultValue={field.value || ''}
                                        id="floating_filled"
                                        className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="floating_filled"
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                    >
                                        {field.label}
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-gray-700">{field.label}</label>
                                    <br/>
                                    {field.label === "Resume Link" ? (
                                        <a href={field.value} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                                            {field.value}
                                        </a>
                                    ) : (
                                        <p className="font-semibold">{field.value || 'N/A'}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidateProfile;
