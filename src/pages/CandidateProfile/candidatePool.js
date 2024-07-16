import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation, useNavigate } from 'react-router';
import { MdOutlinePreview } from "react-icons/md";
import Swal from 'sweetalert2';
import { Circles } from 'react-loader-spinner';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { FcFeedback } from "react-icons/fc";
import { getAllStatus } from '../../Services/CandidateServices';
import { getAllMrf } from '../../Services/ProjectSevices';



const CandidatePool = () => {
  const [MrfId, setMrfId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchSkills, setSearchSkills] = useState('');
  const [searchExperience, setSearchExperience] = useState('');
  const[searchStatus,setSearchStatus] = useState("");
  const [candidateData, setCandidateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const[allMrf,setAllMrf] = useState([]);
  const [paginationOptions, setPaginationOptions] = useState({
    page: 1,
    perPage: 10,
    totalRows: 0,
    currentPageUrl: `${process.env.REACT_APP_API_URL}candidates`, 
    nextPageUrl: null,
    prevPageUrl: null,
  });
  const [allStatus, setAllStatus] = useState([]);


  const data = JSON.parse(localStorage.getItem("data"));
  const accessToken = data?.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(()=>{
    const fetchMrf = async () =>{
      try{
        const res = await getAllMrf();
        if(res){
          setAllMrf(res);
        }
  

      }catch(error){
        console.log(error);
      }
    
    }
    fetchMrf();
  },[])

  console.log("mmmm",allMrf)

  const handleNameSearch = (event) => {
    setSearchName(event.target.value);
  };

  const handleLocationSearch = (event) => {
    setSearchLocation(event.target.value);
  };

  const handleSkillsSearch = (event) => {
    setSearchSkills(event.target.value);
  };

  const handleExperienceSearch = (event) => {
    setSearchExperience(event.target.value);
  };

  const getCandidateData = async () => {
    try {
      setLoading(true);

      const getApiData = await axios.get(paginationOptions.currentPageUrl, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${authorize}`
        }
      });

      if (getApiData?.status === 200) {
        const apiData = getApiData?.data?.data?.candidates;
        setCandidateData(apiData);
        const totalRows = getApiData?.data?.data?.total_candidates;
        setPaginationOptions(prev => ({
          ...prev,
          totalRows: totalRows,
          nextPageUrl: getApiData?.data?.data?.next_page_url,
          prevPageUrl: getApiData?.data?.data?.prev_page_url,
        }));
      }
    } catch (error) {
      console.log("error", error);
      setCandidateData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const getStatus = async () =>{
      try{
        const result = await getAllStatus();
        setAllStatus(result?.data?.data);
    
      }catch(error){
        console.log(error);
      }
    }
    getStatus();
  },[])

  console.log("stat",allStatus)
console.log("candidatedata",candidateData)

useEffect(() => {
  document.title = "CIPLCRM | CandidatePool";
}, []);
  const searchCandidates = async () => {
    try {
      setLoading(true);
      const payload={}
      if (searchStatus) {
        payload.status_id = searchStatus;
      }
      if (MrfId) {
        payload.MRFId = MrfId;
      }
      if (searchName) {
        payload.Name = searchName;
      }
      if (searchLocation) {
        payload.CurrentLocation = searchLocation;
      }
      if (searchSkills) {
        payload.KeySkills = searchSkills;
      }
      if (searchExperience) {
        payload.TotalExperience = searchExperience;
      }
      console.log("Payload",payload)
     

      const searchApiData = await axios.post(`${baseUrl}candidates/SearchCandidates`,payload, {
        headers: {
          'Authorization': `${authorize}`
        }
      });

      if (searchApiData?.status === 200) {
        const apiResponse = searchApiData?.data?.data?.candidates;
        setCandidateData(apiResponse);
        const totalRows = searchApiData?.data?.data?.total_candidates; 
        setPaginationOptions(prev => ({
          ...prev,
          totalRows: totalRows,
          nextPageUrl: null, 
          prevPageUrl: null,
        }));
      } else {
        setCandidateData([]);
      }
    } catch (error) {
      console.log(error);
      setCandidateData([]);

      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchName('');
    setSearchLocation('');
    setSearchSkills('');
    setSearchExperience('');
    getCandidateData();
  };

  useEffect(() => {
    getCandidateData();
  }, [paginationOptions.currentPageUrl]); 

  const hasInterviewRoundStatus = (statuses) => {
    console.log("CandidateStatuses", statuses); // Debugging log
    if (statuses && statuses.length > 0) {
      return statuses.filter(status => 
        status.Status === 'interview round 1' || status.Status === 'interview round 2'
      );
    }
    return false;
  };

  const showFeedbackButton = hasInterviewRoundStatus(candidateData.CandidateStatuses);
  // const getMrfName=(id)=>{
  //   const find=allMrf.find((item)=>item.)
  // }

  const columns = [
    {
      name: 'S. No.',
      selector: (row, index) => index + 1,
      sortable: true,
      width: "85px",
      wrap: true,
    },
    {
      name: 'MrfName',
      selector: row => row?.M_id,
      sortable: true,
      width: "150px",
    },
    {
      name: 'Name',
      selector: row => row?.Name,
      sortable: true,
      width: "150px",
    },
    {
      name: 'Email Id',
      selector: row => row?.EmailId,
      sortable: true,
      width: "180px"
    },
    {
      name: 'Phone',
      selector: row => row?.PhoneNumber,
      sortable: true,
      width: "120px"
    },
    {
      name: 'Location',
      selector: row => row?.CurrentLocation,
      sortable: true,
      width: "170px"
    },
    {
      name: 'Action',
      selector: row => (
        <div className='flex'>
        
          <button title='view candidate profile' onClick={() => navigate(`/admin/candidateProfile/${row?.Id}`)}>
            <MdOutlinePreview
              className="bg-[#103f59] m-1 w-6 p-1 h-6 hover:cursor-pointer"
              fill="white"
              size={30}
            />
          </button>
          {/* {showFeedbackButton && ( */}
 {(row?.CandidateStatus=="Interview round 1" || row?.CandidateStatus=="Interview round 2") && (

 <button
            title='Feedback'
              onClick={() => navigate(`/admin/addCandidateFeedback/${row?.JobApplicationId}`)
              }
            
            >
              <div className="relative text-center  rounded-sm ">
                <div className="group no-underline cursor-pointer relative inline-block text-center ">
                  <FcFeedback
                    className="bg-[#103f59] m-1 w-6 p-1 h-6 hover:cursor-pointer"
                    fill="white"
                    size={30}
                  />
                </div>
              </div>
            </button>
             )}
        </div>
      ),
    }
  ];

  const handleRowClick = (row) => {
    navigate(`/admin/candidateProfile/${row?.Id}`);
  };

  const customStyles = {
    rows: {
      style: {
        cursor: 'pointer',
      },
    },
  };

  const handleNextPage = () => {
    if (paginationOptions.nextPageUrl) {
      setPaginationOptions(prev => ({
        ...prev,
        currentPageUrl: paginationOptions.nextPageUrl,
      }));
    }
  };

  const handlePrevPage = () => {
    if (paginationOptions.prevPageUrl) {
      setPaginationOptions(prev => ({
        ...prev,
        currentPageUrl: paginationOptions.prevPageUrl,
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <ToastContainer position='top-right'/>
      {/* Left Section (Filter) */}
      <div className="sticky top-0 w-1/4 bg-gray-100 p-4 ml-2  ">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">MRF ID</label>
           <select
         typeof='text'
         value={MrfId}
         onChange={(e)=>setMrfId(e.target.value)}
         className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8"
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={searchName}
            onChange={handleNameSearch}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={searchLocation}
            onChange={handleLocationSearch}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <input
            type="text"
            value={searchSkills}
            onChange={handleSkillsSearch}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
          <input
            type="text"
            value={searchExperience}
            onChange={handleExperienceSearch}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8"
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
         <select
         typeof='text'
         value={searchStatus}
         onChange={(e)=>setSearchStatus(e.target.value)}
         className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8"
         >
           <option value="">Choose Status</option>
          {allStatus && allStatus.map((options)=>{
            return(
              <option key={options?.id} value={options?.id}>
                {options?.name}
              </option>
            )
          })}
         </select>

        </div>
        <div className='flex justify-between'>
          <button
            type="submit"
            onClick={searchCandidates}
            className={`text-white bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 bg-[#103f59] hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearSearch}
            className={`text-white bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 bg-[#103f59] hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700`}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Right Section (Candidate Data Table) */}
      <div className="w-3/4 p-4 overflow-auto bg-gradient-to-r from-blue-100 to-blue-200">
        {loading ? (
          <div className="flex justify-center  h-full ">
            <Circles height="180" width="80" color="#00BFFF" ariaLabel="loading" />
          </div>
        ) : (
          <div>
            <DataTable
              columns={columns}
              data={candidateData}
              selectableRows

              pagination
              paginationServer
              paginationTotalRows={paginationOptions.totalRows}
              onChangePage={handleNextPage} 
              onChangeRowsPerPage={() => {}} 
              striped
              highlightOnHover
              responsive
              noHeader
              onRowClicked={handleRowClick}
              customStyles={customStyles}
              paginationComponentOptions={{
                noRowsPerPage: true,
                rangeSeparatorText: 'of',
                selectAllRowsItem: false,
                selectAllRowsItemText: 'All'
              }}
            />
          </div>
        )}

        {/* Pagination controls */}
        <div className='flex justify-between mt-4'>
          {paginationOptions.prevPageUrl && (
            <button
              type="button"
              onClick={handlePrevPage}
              className={`text-white font-medium rounded-lg text-sm px-4 py-2 bg-[#103f59] hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700`}
            >
              Previous
            </button>
          )}
          {/* {paginationOptions.nextPageUrl && (
            <button
              type="button"
              onClick={handleNextPage}
              className={`text-white font-medium rounded-lg text-sm px-4 py-2 bg-gray-700 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700`}
            >
              Next
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CandidatePool;
