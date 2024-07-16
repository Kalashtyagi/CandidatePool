import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router";
import { FaEye, FaPenSquare, FaPlusCircle } from "react-icons/fa";
import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { HiPlus } from 'react-icons/hi'
import { getAllHod,getAllProjectLead } from "../../Services/ProjectSevices";
import { hasPermission } from "../../components/HasPermission";
import { Circles } from "react-loader-spinner";


export default function Mrf() {
  const [selectedOption, setSelectedOption] = useState('inhouse');
  const [filterText, setFilterText] = useState('');
  const [allMrfData, setAllMrfData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const[pidOptions,setPidOptions] = useState([]);
  const[selectedPid,setSelectedPid] = useState("");
  const[allHod,setAllHod]=useState([]);
  const[projectLead,setAllProjectLead]=useState([])
  const[loader,setLoader]=useState(false);

  const navigate = useNavigate();
  const localData = JSON.parse(localStorage.getItem("data"));
  const accessToken = localData && localData?.access_token;
  const authorize = "Bearer" + " " + accessToken;


  useEffect(() => {
    document.title = "CIPLCRM | MRF";
  }, []);

  useEffect(()=>{
    const fetchData=async()=>{
     try{
       const hodResponse=await getAllHod()
       if(hodResponse){
         setAllHod(hodResponse)
       }
       const projectLeadResponse=await getAllProjectLead();
       if(projectLeadResponse){
         setAllProjectLead(projectLeadResponse);
       }
     }catch(error){
       console.log(error)
     }
    }   
    fetchData();     
 },[])


  const getAllMrf = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}jobs/GetMrfRecruitmentType`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorize}`
        },

        params:{
          recruitment_type:selectedOption
        }
      });
      if (response?.status === 200) {
        const MrfData = await response?.data?.data;
        setFilterData(MrfData);
        setLoader(false);
        

      }
    } catch (error) {
      console.log(error);
      setFilterData([]);
      setLoader(false);


    }
  };


  
  useEffect(() => {
    getAllMrf();
  }, [selectedOption]);

  const getAllPid = async () =>{
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/onsite`,{
        headers:{
          Authorization:`${authorize}`,
          "Content-Type":"application/json"
        }
      })
      setPidOptions(response?.data?.data);

    }catch(error){
      console.log(error);
    }
  }

  const getMrfId = async() =>{
    setLoader(true);
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}leadstest/${selectedPid}`,{
        headers:{
          Authorization:`${authorize}`,
          "Content-Type":"application/json"
        }
      })
if(response?.status===200){
  setFilterData(response?.data?.data)
  setLoader(false);
}else{
  setFilterData([])
  setLoader(false)
}
    }catch(error){
      console.log(error);
      setFilterData([])
      setLoader(false)

    }
  }

  useEffect(()=>{
    if(selectedPid){
      getMrfId();
    }

  },[selectedPid])


  useEffect(()=>{
    if(selectedOption=="onsite"){
      getAllPid();
    }
  
  },[selectedOption])

  

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterText(value);
    if (value === '') {
      setFilterData(allMrfData.filter((item) => item?.job?.recruitment_type === selectedOption));
    
    }
  };
  
 
 
  const getProjectLead=(id)=>{
    const statusObj=projectLead.find((status)=>status.id==id)
    console.log("statusObj",statusObj)
    return statusObj?.name
  }
  
  const getHod=(id)=>{
    const statusObj=allHod.find((status)=>status.id==id)
    return statusObj?.name
  }

  const mrfStatusList = [
    { id: 1, status: "Open", color: "green" },
    { id: 2, status: "Closed", color: "brown" },
    { id: 3, status: "Approved", color: "yellow" },
    { id: 4, status: "Reject", color: "gray" }
  ];
  const getStatusFromId = (id) => {
    console.log("ID",id)
    const statusObj = mrfStatusList.find((status) => status.id == id);
    console.log("statusoJB",statusObj)
    return statusObj ? statusObj : { status: "Unknown", color: "black" };
  };
  
  const tableHeading = [
    {
      name: <div className="text-sm font-medium">Pid</div>,
      selector: (row) => <div className="capitalize">{row?.job?.pid}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Project Manager</div>,
      selector: (row) => <div className="capitalize">{getProjectLead(row?.project_manager)}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Designation</div>,
      selector: (row) => <div className="capitalize">{row.degination}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Category</div>,
      selector: (row) => <div className="capitalize">{row.category?.name}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Requisition Date</div>,
      selector: (row) => <div className="capitalize">{row?.start_date}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Target Date</div>,
      selector: (row) => <div className="capitalize">{row?.end_date}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Reporting Team</div>,
      selector: (row) => <div className="capitalize">{getHod(row?.reporting_team)}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Location</div>,
      selector: (row) => <div className="capitalize">{row?.location}</div>,
      sortable: true,
    },
    {
      name: "Mrf Status",
      selector: (row) => {
        const { status, color } = getStatusFromId(row?.MrfStatus);
        return (
          <button
            style={{ backgroundColor: color, color: "black", padding: "5px 10px", borderRadius: "5px" }}
            className="capitalize"
          >
            {status}
          </button>
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex justify-center">
          {row?.assigned?.find((a) => a?.user_id === localData?.data?.id) ||
            localData?.data?.roles[0]?.id === 1 ? (
            <>

              <div className="group flex items-center">
                <button
                  onClick={() => {
                    navigate("/admin/viewleads", { state: row });
                  }}
                >
                  <div className="relative text-center  rounded-sm">
                    <div class="group no-underline cursor-pointer relative inline-block text-center">
                      <FaEye
                        size={30}
                        className="hover:bg-white p-1 mr-1 text-xl"
                      />
                      <div class="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                        View Mrf
                      </div>
                    </div>
                  </div>
                </button>
               
              </div>
             
            </>
          ) : (
            <span className="px-[13px]">&nbsp;</span>
          )}
                       {row.MrfStatus==3 && (

           <Link
                    to={"/admin/addassignee"}
                    state={row}
                    className="group flex items-center"
                  >
                    <div className="relative text-center  rounded-sm">
                      <div class="group no-underline cursor-pointer relative inline-block text-center">
                        <HiPlus
                          size={26}
                          className="hover:bg-white p-1 mr-1 text-xl"
                        />
                        <div class="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                          Add Candidate
                        </div>
                      </div>
                    </div>
                  </Link>
                       )}
        </div>
      ),
      sortable: false,
      allowOverflow: true,
    },
  ];
  const filteredData = filterData.filter(
    (item) =>
      item.degination &&
      item.degination.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleSearch=async()=>{
    if(filterText.length>0){
      const filter=filterData.filter((item)=>item.degination && item.degination.toLowerCase().includes(filterText.toLowerCase()))
      setFilterData(filter)
    }
   
  }

  console.log("pp",hasPermission("add_mrf"))

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-blue-200">
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
              onChange={handleFilter}
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-[#103f59] text-white rounded shadow"
            >
              Search
            </button>
          </div>
          {hasPermission("add_mrf") && selectedOption == "inhouse" && (
            <button
              onClick={() => navigate('/admin/addMrf',{state:{recruitment_type:selectedOption}})}
              className="p-2 bg-[#103f59] text-white rounded shadow"
            >
              Add MRF Without Pid
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">MRF List</h1>
        {selectedOption === 'onsite' && (
          <select className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
          onChange={(e)=>setSelectedPid(e.target.value)}>
            <option value="">Please select PId</option>
            {pidOptions && pidOptions.map((item)=>(
              <option key={item.id}
              value={item.id}>
                {item.pid}
              </option>
            ))}
          </select>
        )}
      </div>
     {loader ?
        <div className=" flex justify-center items-center ">
          <Circles color="#00BFFF" height={80} width={80} />
        </div>
      : <div className="bg-white shadow-lg rounded-lg p-4">
        <DataTable
          columns={tableHeading}
          data={filterData}
          pagination
          highlightOnHover
          className="w-full"
        />
      </div>} 
    </div>
  );
}
