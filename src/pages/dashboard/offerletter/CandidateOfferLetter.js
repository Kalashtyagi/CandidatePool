import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router";
import { FaEye, FaPenSquare, FaPlusCircle } from "react-icons/fa";
import Select from "react-select";
import { SlEnvolopeLetter } from "react-icons/sl";
import { offerletterActions } from "../../../Redux/dashboard/offerletter/offerletterSlice.js";
import { useDispatch } from "react-redux";
import UserProfile from "../../../components/UserProfile";
import ApiErrorPopUp from "../../../components/ApiErrorPopUp";
import { ToastContainer,toast } from "react-toastify";
import { hasPermission } from "../../../components/HasPermission.js";
import { Circles } from "react-loader-spinner";




export default function CandidateOfferLetter() {
  const [selectedOption, setSelectedOption] = useState('inhouse');
  const [filterText, setFilterText] = useState('');
  const [allMrfData, setAllMrfData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [candidateData,setCandidateData] = useState([]);
  const[pidOptions,setPidOptions] = useState([]);
  const[selectedPid,setSelectedPid] = useState("");
  const[selectedMRF,setSelectedMRF] = useState("");
  const [showEditPopUp, setShowEditPopup] = useState("");
  const [showModalId, setShowModalId] = useState("");
  const [template_id, setTemplate_id] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showApiErrorPopUp, setShowApiErrorPopUp] = useState(false);
  const [apiError, setApiError] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [dataOfferletter, setDataOfferletter] = useState([]);
  const [profileData, setProfileData] = useState("");
  const[candidateId,setCandidateId]=useState(null);
  const[candidateRow,setCadidateRow] = useState({});
  const[searchFilterData,setSearchFilterData]=useState([]);
  const[loader,setLoader]=useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jsonData = JSON.parse(localStorage.getItem("data"));
  console.log("jsonData",jsonData)
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;

  
  useEffect(() => {
    localStorage.setItem("joining_date", joiningDate);
    dispatch(offerletterActions.AddofferletterDate(joiningDate));
  }, [joiningDate]);


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
        setFilterData(MrfData && MrfData.filter((item) => item?.job?.recruitment_type == selectedOption));
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("fil",filterData);

  useEffect(() => {
    getAllMrf();
  }, []);



  const getFilterData = () => {
    const filter = allMrfData.filter((item) => item?.job?.recruitment_type === selectedOption);
    setFilterData(filter);
  };

  useEffect(() => {
    getFilterData();
  }, [selectedOption]);


// const searchInput=()=>{
//     const filter=candidateData?.filter((item)=>item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase()))
//     setSearchFilterData(filter);
// }

 

  const getPid = async() =>{
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/onsite`,{
            headers:{
                Authorization:`${authorize}`,
                "Content-Type":"application/json"
            }
        })

        if(response?.status===200){
            const filterPid = response?.data?.data.filter(item=>(
                item.recruitment_type=="onsite"
            ))
            setPidOptions(filterPid)

        }
       
    }catch(error){
        console.log(error);
    }
  }
  console.log("pid",pidOptions)

  useEffect(()=>{
    getPid();
  },[selectedOption=="onsite"])


  const searchCandidates = async () => {
    setLoader(true);
    try {
      const payload = {
        MRFId: selectedMRF,
      };
  
      // Define a function to handle individual API calls and error handling
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
  
      // Execute both API calls concurrently
      const [apiResponse13, apiResponse18,apiResponse25,apiResponse29] = await Promise.all([
        fetchData(13),
        fetchData(21),
        fetchData(25),
        fetchData(29)
      ]);
  
      // Combine candidates from both responses
      const combinedCandidates = [...apiResponse13, ...apiResponse18,...apiResponse25,...apiResponse29];
      console.log(combinedCandidates);
  
      // Update state with combined candidates
      setCandidateData(combinedCandidates);
      setSearchFilterData(combinedCandidates);
    } catch (error) {
      console.error('Error in searchCandidates:', error);
      toast.error('Failed to fetch candidates');
      setCandidateData([]);
    }finally{
      setLoader(false);
    }
  };
  useEffect(()=>{
    searchCandidates();

  },[selectedMRF])

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
          onClick={() =>navigate(`/admin/candidateProfile/${row.Id}`) }
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
      name: "Offer_letter",
      selector: (row, index) => (
        <div className="">
          {hasPermission("add_offerletter")
           ? (
            <button
            title="Send offer letter"
              onClick={() => {
                setShowEditPopup(true);
                setShowModalId(row?.id);
                setCandidateId(row?.Id)
                setCadidateRow(row);
                localStorage.setItem("get_id", index)
              }}
            >
              <SlEnvolopeLetter
                className="bg-[#103f59] m-1 w-6 p-1 h-6 hover:cursor-pointer"
                fill="white"
                size={30}
              />
            </button>
          ) : null}
        </div>
      ),
      sortable: false,
      allowOverflow: true,
    },
  ];

  const handleShow = () => {
    if(template_id==null || joiningDate==""){
        toast.error("Please select template id/joining date")

    }
    else{
        navigate(`SendOfferLetter/${template_id}/${candidateId}`,{state:candidateRow});

    }
   
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
  };


  useEffect(() => {
    document.title = "CIPLCRM | Offer letter";

    axios
      .get(
        `${process.env.REACT_APP_API_URL}offerletter`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authorize}`,
          },
        }
      )
      .then((res) => {
        setDataOfferletter(res?.data?.data);
        console.log(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const options = [];

//   console.log(OfferLetters);

  dataOfferletter?.map((ele) => {
    options.push({
      value: ele?.id,
      label: ele?.templatename,
    });
  });


  const handleSelectedMRF = (e) =>{
    setSelectedMRF(e.target.value)
  }


  return (
    <div>
    <ToastContainer position="top-right"/>
         <UserProfile
        profileData={profileData}
        setShowProfilePopup={setShowProfilePopup}
        showProfilePopup={showProfilePopup}
      />
      {showApiErrorPopUp ? (
        <ApiErrorPopUp setModal={setShowApiErrorPopUp} error={apiError} />
      ) : null}
      {showEditPopUp ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
          
            <div className="relative w-auto my-6 h-44 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none offer_letter_t">
                <>
                  {/* <div className="grid px-1 shaodw bg-white rounded m-2 grid-cols-1">
                    <div className="p-2">
                      <button
                        className="p-1 ml-auto border-0 text-red-500  float-right text-3xl leading-none font-semibold "
                        onClick={() => setShowEditPopup(false)}
                      >
                        <span className=" text-red-500 h-6 w-6 text-xl block ">
                          X
                        </span>
                      </button>
                      <h1 className=" text-2xl text-solid">Offer Letter</h1>
                      <QuestionEditor setConvertedContent={setData} />
                    </div>
                  </div> */}

                  <div className="m-4">
                    <button
                      className="p-1 ml-auto border-0 text-red-500  float-right text-3xl leading-none font-semibold"
                      onClick={handleClosePopup}
                    >
                      <span className="text-red-500 h-6 w-6 text-xl block">
                        X
                      </span>
                    </button>
                    <p className="text-lg">Select Template</p>
                    <Select
                      options={options}
                      placeholder="Select Template"
                      className="mt-3"
                      onChange={(val) => setTemplate_id(val.value)}
                    />
                  </div>
                </>

                <div className="flex px-5 py-2 items-center justify-between">
                  {/* <Select
                                                options={teamList && teamList?.map((x) => ({ label: x?.name, value: x?.id }))}
                                                onChange={(e) => setSelectedTeamMember(e.value)}
                                            /> */}
                  <div>
                    <label
                      className={
                        "after:content-[" * "] after:ml-0.5 after:text-red-500"
                      }
                    >
                      Joining Date
                    </label>
                    <input
                      required
                      type="date"
                      className="border border-gray-200 px-2 block"
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                  </div>
                  <div className="pl-3 h-fit mt-5">
                    {/* <button
                      type="button"
                      onClick={handleSubmit}
                      className=" bg-gray-700 text-white  h-10 w-14  hover:bg-black hover:text-white rounded"
                    >
                      Send
                    </button> */}
                    <button
                      type="button"
                      onClick={handleShow}
                      className=" ml-2 bg-gray-700 text-white  h-10 w-14  hover:bg-black hover:text-white rounded"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
         <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-blue-200">
         <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Offer Letter</h1>

    
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
              // onClick={searchInput}
              className="p-2 bg-[#103f59] text-white rounded shadow"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {selectedOption=="inhouse" && (
        <div>
             <select className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
             onChange={handleSelectedMRF}>
         <option value="">Please select MRF</option>
         {filterData && filterData.map((item)=>(
            <option key={item.id} value={item.id}>{item.M_id ?? item.id}</option>
         ))}
       </select>
            </div>
        
      )} 
          {selectedOption === 'onsite' && (
            <div>
                 <select className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700" onChange={(e)=>setSelectedPid(e.target.value)}>
            <option value="">Please select PId</option>
            {pidOptions && pidOptions?.map((item)=>(
                <option key={item.pid} value={item.pid}
                >
                    {item.pid}
                </option>
            ))}
          </select>
          <select className="mb-2 ml-10 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700" onChange={handleSelectedMRF}>
            <option value="">Please select MRF</option>
            {filterData && filterData.filter((item)=>item?.job?.pid === selectedPid).map((item)=>(
                <option value={item.id} key={item.id}>
                    {item.M_id ?? item.id}
                </option>
            ))}
          </select>
                </div>
         
        )}
    
     {loader? <div className=" flex justify-center items-center ">
          <Circles color="#00BFFF" height={80} width={80} />
        </div>:<div className="bg-white shadow-lg rounded-lg p-4">
        <DataTable
          columns={tableHeading}
          data={searchFilterData}
          pagination
          highlightOnHover
          className="w-full"
        />
      </div>} 
    </div>

    </div>
   
  );
}
