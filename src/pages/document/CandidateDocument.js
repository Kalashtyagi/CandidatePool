import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BsSendFill } from "react-icons/bs";
import { Circles } from "react-loader-spinner";

import { useNavigate,useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
export default function CandidateDocument() {
  const [selectedOption, setSelectedOption] = useState('inhouse');
  const [filterText, setFilterText] = useState('');
  const [allMrfData, setAllMrfData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [pidOptions, setPidOptions] = useState([]);
  const [selectedPid, setSelectedPid] = useState("");
  const [selectedMRF, setSelectedMRF] = useState("");
  const [searchFilterData, setSearchFilterData] = useState([]);
  const[loading,setLoading] = useState(false);
 

  const navigate = useNavigate();

  const jsonData = JSON.parse(localStorage.getItem("data"));
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;
  let page=""
  const getAllMrf = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}jobs/erf`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorize}`
        }
      });
      if (response?.status === 200) {
        const MrfData = await response?.data?.data;
        setAllMrfData(MrfData);
        setFilterData(MrfData && MrfData.filter((item) => item?.job?.recruitment_type === selectedOption));
      }
    } catch (error) {
      console.log(error);
    }
  };
useEffect(()=>{
  getAllMrf();
},[])
  const getFilterData = () => {
    const filter = allMrfData.filter((item) => item?.job?.recruitment_type === selectedOption);
    setFilterData(filter);
  };

  useEffect(() => {
    getFilterData();
  }, [selectedOption]);

  const searchInput = () => {
    const filter = candidateData?.filter((item) => item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase()));
    setSearchFilterData(filter);
  };

  const getPid = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/onsite`, {
        headers: {
          Authorization: `${authorize}`,
          "Content-Type": "application/json"
        }
      });

      if (response?.status === 200) {
        const filterPid = response?.data?.data.filter(item => (
          item.recruitment_type === "onsite"
        ));
        setPidOptions(filterPid);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPid();
  }, [selectedOption === "onsite"]);
 

  const searchCandidates = async () => {
    setLoading(true);
    try {
      
      const payload = {
        MRFId: selectedMRF,
      };
  
      const fetchData = async (statusId) => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}candidates/SearchCandidates`,
            { ...payload, status_id: statusId },
            {
              headers: {
                Authorization: `${authorize}`,
              },
            }
          );
          return response?.data?.data?.candidates || [];
        } catch (error) {
          console.error(`Error fetching candidates for status ${statusId}:`, error);
          // toast.error(error?.response?.data?.message);
          return []; // Return empty array on error to handle gracefully
        }
        
      };
  
      const [apiResponse13, apiResponse23,apiResponse24] = await Promise.all([
        fetchData(13),
        fetchData(23),
        fetchData(24),

      ]);
  
      const combinedCandidates = [...apiResponse13, ...apiResponse23,...apiResponse24];

      setCandidateData(combinedCandidates);
      setSearchFilterData(combinedCandidates);
    } catch (error) {
      console.error('Error in searchCandidates:', error);
      toast.error('Failed to fetch candidates');
      setCandidateData([]);
    }
    finally{
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // if (selectedMRF) {
      searchCandidates();
    // }
  }, [selectedMRF]);

  const handleDocumentVerification = async (id) => {
    try {
      setLoading(true);
      const request = await axios.get(
        `${process.env.REACT_APP_API_URL}documents/uploadlink/${id}`,
        {
          headers: {
            Authorization: `${authorize}`,
            Accept: "application/json",
          },
        }
      );
      const response = await request?.data;
      if (response?.code === 200) {
        toast.success(`${response?.message}`);
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
  };
 const documentStatus = [
  {
    id :23,
    status:"Mail sent",
    color: "yellow"
  },
  {
    id :24,
    status:"Document uploaded",
    color: "green"
  },
  {
    id :13,
    status:"Interview round 2-clear",
    color: "sky blue"
  },
  {
    id :25,
    status:"Document Verify",
    color: "blue"
  },
  
    {
      id :26,
      status:"Document Not verified",
      color: "sky blue"
    }
 ]

  const getStatus = (id) =>{
    const data = documentStatus?.find((item)=>item.id==id)
    return data?data:{status:"unKnown",color:"pink"}   
  }
  

  const tableHeading = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => (
        <button
          className="text-blue-700 hover:text-blue-900"
          onClick={() => navigate(`/admin/candidateProfile/${row.Id}`)}
        >
          {row?.Name}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.EmailId,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row?.PhoneNumber,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        
        const {status,color} = getStatus(row?.status_id)
        return(
          <button style={{backgroundColor:color,color: 'black',
            padding: '8px 12px',
            borderRadius: '5px',
            minWidth: '120px',
            whiteSpace: 'nowrap',
            textAlign: 'center',}}>{status}</button>
        )
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          
            <button onClick={()=>handleDocumentVerification(row.Id)}>
              <div className="relative text-center  rounded-sm">
                      <div className="group no-underline cursor-pointer relative inline-block text-center">
                        <BsSendFill
                          size={30}
                          className="text-[#103f59] p-1 mr-1 text-xl"
                        />
                        <div className="opacity-0 w-42 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                           Send Upload Document Link
                        </div>
                      </div>
                    </div>
              
            </button>
            <button onClick={() => navigate(`/admin/viewDocs/${row.Id}`, { state: {row,authorize,page} })}>
              <div className="relative text-center  rounded-sm">
                      <div className="group no-underline cursor-pointer relative inline-block text-center">
                        <FaEye
                          size={30}
                          className="text-[#103f59] p-1 mr-1 text-xl"
                        />
                        <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                           Verify Document
                        </div>
                      </div>
                    </div>
            </button>
        </div>
      ),
      sortable: false,
      allowOverflow: true,
    },
  ];

  useEffect(() => {
    document.title = "CIPLCRM | Salary";
  }, []);

  const handleSelectedMRF = (e) => {
    setSelectedMRF(e.target.value);
  }

  return (
    <div>
      <ToastContainer position="top-right" />
      <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800"> Document Verification</h1>
        </div>
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="inhouse"
                checked={selectedOption === 'inhouse'}
                onChange={() => setSelectedOption('inhouse')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-lg font-semibold text-gray-700">Inhouse</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="onsite"
                checked={selectedOption === 'onsite'}
                onChange={() => setSelectedOption('onsite')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-lg font-semibold text-gray-700">Onsite</span>
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border border-gray-300 rounded shadow-sm"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
              <button
                onClick={searchInput}
                className="p-2 bg-[#103f59] text-white rounded shadow"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {selectedOption === "inhouse" && (
          <div>
            <select className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              onChange={handleSelectedMRF}>
              <option value="">Please select MRF</option>
              {filterData && filterData.map((item) => (
                <option key={item.id} value={item.id}>{item.M_id ?? item.id}</option>
              ))}
            </select>
          </div>
        )}
        {selectedOption === 'onsite' && (
          <div>
            <select className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700" onChange={(e) => setSelectedPid(e.target.value)}>
              <option value="">Please select PId</option>
              {pidOptions && pidOptions?.map((item) => (
                <option key={item.pid} value={item.pid}>
                  {item.pid}
                </option>
              ))}
            </select>
            <select className="mb-2 ml-10 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700" onChange={handleSelectedMRF}>
              <option value="">Please select MRF</option>
              {filterData && filterData.filter((item) => item?.job?.pid === selectedPid).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.M_id ?? item.id}
                </option>
              ))}
            </select>
          </div>
        )}
        {loading ? (
           <div className="flex justify-center  h-full ">
           <Circles height="180" width="80" color="#00BFFF" ariaLabel="loading" />
         </div>
          

        ):(
          <div className="bg-white shadow-lg rounded-lg p-4">
          <DataTable
            columns={tableHeading}
            data={searchFilterData}
            pagination
            highlightOnHover
            className="w-full"
          />
        </div>

        )}
       
      </div>
    </div>
  );
}
