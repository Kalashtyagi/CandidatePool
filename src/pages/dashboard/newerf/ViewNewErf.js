import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import axios from "axios";
import { FaEye, FaPenSquare, FaPlusCircle } from "react-icons/fa";
import AddErfData from "./AddErfData";
import EditErfData from "./EditErfData";
import { HiPlus } from "react-icons/hi";
import { AiOutlineFileText } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { AiFillCloseCircle} from "react-icons/ai";
import { getAllHod,getAllProjectLead } from "../../../Services/ProjectSevices";
import CustomNoDataComponent from "../../../components/TableMessage";
import BackButton from "../../../components/BackButton";
import { hasPermission } from "../../../components/HasPermission";


const ViewNewErf = () => {
  const [search, setSearch] = useState("");
  const [erfData, setErfData] = useState("");
  const [rowData, setRowData] = useState("");
  const [numberOfPosition, setNumberOfPosition] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [jobId, setJobId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { state } = useLocation();
  const [searchAssignee, setSearchAssignee] = useState("");
  const [teamList, setTeamList] = useState("");
  const [rowId, setRowId] = useState("");
  const [remainingPositions, setRemainingPositions] = useState(0);
  const [totalPosition, setTotalPosition] = useState(0);
  const[allHod,setAllHod]=useState([]);
  const[projectLead,setAllProjectLead]=useState([])


  useEffect(()=>{
     const fetchData=async()=>{
      try{
        const hodResponse=await getAllHod()
        if(hodResponse){
          setAllHod(hodResponse)
        }
        const projectLeadResponse=await getAllProjectLead();
        if(projectLeadResponse){
          setAllProjectLead(projectLeadResponse)
          
        }
      }catch(error){
        console.log(error)
      }
     }   
     fetchData();     
  },[])
  const leadsData = [
    {
      position: 0,
      userId: "",
      requirement: "no",
    },
  ];
  const [leadInput, setLeadInput] = useState([]);

  // console.log('leads input data', leadInput)
  console.log('STATE',state);

  useEffect(() => {
    console.log("39", leadInput);
    let sum = 0;
    leadInput.map((ele) => {
      sum += ele.position;
    });

    setTotalPosition(sum);
  }, [leadInput]);

  useEffect(() => {
    console.log("50", totalPosition);
    console.log("49", remainingPositions);
  }, [totalPosition, leadInput]);

  const navigate = useNavigate();
  // console.log("erf data", erfData)

  const localData = JSON.parse(localStorage.getItem("data"));
  const localDataUserId = localData?.data?.roles[0]?.name;
  const accessToken = localData?.access_token;
  console.log("localData",localData);
  let id=state?.id;
  console.log('STATE',state);
  useEffect(()=>{ 
    if(state!=null){
      id=state?.id
      localStorage.setItem('id',state?.id)    
    }
    else{ 
      id=localStorage.getItem('id');
    }
   
   
  },[])
  console.log("Id",id)



  const getErfLeads = async () => {
    const request = await axios.get(
      `${process.env.REACT_APP_API_URL}leadstest/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const response = request?.data;
    console.log("erf data", response);
    if (response?.code === 200) {
      if (localDataUserId === "admin") {
        setErfData(response?.data);
        // console.log('admin erf data',response?.data)
      } else if (
        response?.data?.filter(
          (y) =>
            y.created_by_id === localData?.data?.id &&
            y.assigned.some((z) => z.user_id === localData?.data?.id)
        )
      ) {
        const filteredData = response?.data?.filter(
          (y) =>
            y.created_by_id === localData?.data?.id ||
            y.assigned.some((z) => z.user_id === localData?.data?.id)
        );
        // console.log("filteredata",filteredData)
        setErfData(filteredData);
      }
      // else{
      //   setErfData(response?.data.length>0 && response?.data?.filter(y=>y.assigned.length>0 && y.assigned?.filter(x=>)))
      // }
    }
  };

  // console.log('erfdata',erfData)

  useEffect(() => {
    getErfLeads();
  }, []);

 
  const closeMrf=async(id)=>{
    try{
      const response=await axios.post(`${process.env.REACT_APP_API_URL}mrfstatus/${id}`,{MrfStatus:2},{
        headers:{
          Authorization: `Bearer ${accessToken}`,

        }
      })
      if(response?.status===200){
        getErfLeads();
        toast.success("Mrf closed Successfully")
      }
      console.log("response",response)

    }catch(error){
      console.log("error",error);
    }
  }
  const mrfStatusList = [
    { id: 1, status: "Open", color: "green" },
    { id: 2, status: "Closed", color: "brown" },
    { id: 3, status: "Approved", color: "yellow" },
    { id: 4, status: "Reject", color: "gray" }
  ];
  
  const getStatusFromId = (id) => {
    const statusObj = mrfStatusList.find((status) => status.id === id);
    return statusObj ? statusObj : { status: "Unknown", color: "black" };
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
  const tableHeading = [
    {
name:"MRF ID",
selector:(row) =>( <div>{row?.M_id}</div>),
sortable:true,

    },
    {
      name: "Project Manager",
      selector: (row) => (
        <div className="capitalize">{getProjectLead(row?.project_manager)}</div>
      ),
      sortable: false,
    },
    {
      name: "Designation",
      selector: (row) => <div className="capitalize">{row.degination}</div>,
      sortable: false,
    },
    {
      name: "Category",
      selector: (row) => (
        <div className=" capitalize">{row.category?.name}</div>
      ),
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Requisition Date</div>,
      selector: (row) => <div className=" capitalize">{row?.start_date}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Target Date</div>,
      selector: (row) => <div className=" capitalize">{row?.end_date}</div>,
      sortable: false,
    },
    {
      name: "Reporting Team",
      selector: (row) => (
        <div className=" capitalize">{getHod(row?.reporting_team)}</div>
      ),
      sortable: false,
    },
    {
      name: "Location",
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
         
            <>
             {hasPermission("add_candidate") && row.MrfStatus==3 && 
                 (
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
                          Add C.V.
                        </div>
                      </div>
                    </div>
                  </Link>
                ) }

              <div className="group flex items-center">
                {
                  hasPermission("view_mrf") && (
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
                          View MRF
                        </div>
                      </div>
                    </div>
                  </button>

                  )
                }
              </div>
              {hasPermission("delete_mrf") && row?.MrfStatus==3 && (
                <button onClick={() => closeMrf(row?.id)}>
                   <div className="relative text-center rounded-sm">
                    <div className="group no-underline cursor-pointer relative inline-block text-center">
                      <AiFillCloseCircle
                        size={30}
                        className="hover:bg-white p-1 mr-1 text-xl"
                      />
                      <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                       Close Mrf
                      </div>
                    </div>
                  </div>
                </button>)}
             
            </>
         
        </div>
      ),
      sortable: false,
      allowOverflow: true,
    },
   
  
  ];

  const filteredData =
    erfData &&
    erfData?.filter((data) =>
      data?.project_manager === null || undefined || ""
        ? data
        : data?.project_manager?.toLowerCase().includes(search)
    );

  console.log('filtered',filteredData)

  const handleInputChange = (e, index, { teamId }) => {
    let inputValue = parseInt(e.target.value) || 0;

    if (inputValue > remainingPositions) {
      toast.error("Press Number less than Remaining Positions");
    }
    if (inputValue > numberOfPosition) {
      inputValue = 0;
    }

    if (leadInput.find((x) => x.userId !== teamId)) {
      e.target.value = parseInt(inputValue);
      let newData = {
        position: parseInt(inputValue),
        userId: teamId,
        requirement: "",
      };
      setLeadInput([...leadInput, newData]);
    }
    if (leadInput.find((x) => x.userId === teamId)) {
      const updatedLeadInput = leadInput.map((item) => {
        if (item.userId === teamId) {
          return {
            ...item, // spread the existing properties of the object
            position: parseInt(inputValue), // update the position property
          };
        }
        return item; // return the item as is if it's not the one to be updated
      });
      setLeadInput(updatedLeadInput);
    }
  };

  const handleSelectChange = (e, index, { teamId }) => {
    if (e.target.value === "yes") {
      let newData = {
        position: 0,
        userId: teamId,
        requirement: e.target.value,
      };
      // setLeadInput([newData])
      setLeadInput([...leadInput, newData]);
    }
    if (leadInput.find((x) => x.userId === teamId)) {
      if (leadInput.find((x) => x.userId !== teamId)) {
        let data = [...leadInput];
        data[index].requirement = e.target.value;
        data[index].userId = teamId;
        setLeadInput(data);
      }
    }
    if (leadInput.find((x) => x.userId === teamId)) {
      if (e.target.value === "no" || "") {
        let data = [...leadInput];
        data.splice(index, 1);
        setLeadInput(data);
      }
    }
  };

  const showData = [
    // {
    //   title: "Project ID",
    //   data: state?.erf_id,
    // },
    {
      title: "PID",
      data: state?.pid,
    },
    {
      title: "Project Name",
      data: state?.project_name,
    },
    {
      title: "Type",
      data: state?.recruitment_type,
    },
    // {
    //   title: "Billable",
    //   data: state?.billable_type,
    // },
    {
      title: "Department",
      data: state?.department?.name,
    },
    
  ];
  const filteredData1= showData.filter(item => {
    if (state?.recruitment_type === "inhouse" && (item.title === "PID" || item.title === "Project Name")) {
      return false;
    }
    return true;
  });
  

  const filteredTeamList =
    teamList &&
    teamList?.filter(
      (teamName) =>
        teamName && teamName?.name?.toLowerCase()?.includes(searchAssignee)
    );

  useEffect(() => {
    if (remainingPositions <= numberOfPosition && remainingPositions >= 0) {
      const numberMap = leadInput && leadInput?.map((l) => l.position);

      const totalNumbr =
        numberMap?.length > 0 ? numberMap?.reduce((a, c) => a + c) : 0;

      let add = 0;
      for (let i = 0; i < numberMap?.length; i++) {
        add += numberMap[i]; // add each value to the total
      }
      // console.log("add",add)
      const subsValue = numberOfPosition - totalNumbr;
      // console.log("sub values",subsValue)
      if (subsValue < 0) {
        setRemainingPositions(0);
      } else {
        setRemainingPositions(subsValue);
      }
    }
  }, [leadInput]);

  // useEffect(()=>{
  //   const numberMap = leadInput && leadInput?.map(l=>parseInt(l.position))
  //   const result = array.reduce((accumulator, currentValue) => {
  //     return {
  //       value: accumulator.value - currentValue.amount, // subtract each amount from the value
  //     };
  //   }, totalValue);
  // },[])

  // console.log("remaining position",remainingPositions)

  return (
    <>
    <div className='overflow-y-auto max-h-[calc(100vh-50px)]'>
      <ToastContainer autoClose={3000} position="top-right"/>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-2/3">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between lg:p-5 p-4 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Select Assignee</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    <span className="bg-transparent text-red-500  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto">
                  <form className="p-3 w-full rounded ">
                    <div className="p-2 border rounded">
                      <div className="table-responsive m-t-20">
                        <div>
                          <div className="flex justify-end">
                            <div className="">
                              <div></div>
                            </div>
                            <div className=" col-span-12 md:col-span-6 ">
                              <div>
                                <label>Search:</label>
                                <input
                                  type="search"
                                  className="form-control form-control-sm rounded border p-2 ml-2"
                                  placeholder=""
                                  onChange={(e) =>
                                    setSearchAssignee(
                                      e.target.value.toLowerCase()
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="h-52 my-2 overflow-y-auto no-scrollbar rounded-md justify-between w-26 px-4 py-2 ">
                            <div className="border p-2 border-collapse min-w-full text-left no-scrollbar  overflow-y-scroll">
                              <div>
                                <div className="p-2 grid grid-cols-3">
                                  {["Name", "Require", "No. of positions"]?.map(
                                    (x, index) => (
                                      <div className="p-1" key={index}>
                                        {x}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                              {filteredTeamList &&
                                filteredTeamList?.map((team, index) => {
                                  return (
                                    <div className="" key={index}>
                                      <div className="bg-gray-200 grid grid-cols-3 p-2 border-b border-white">
                                        <div className="p-1">{team.name}</div>
                                        <div className="p-1">
                                          <select
                                            name="requirement"
                                            onChange={(e) =>
                                              handleSelectChange(e, index, {
                                                teamId: team?.id,
                                              })
                                            }
                                          >
                                            <option value={""}>Select</option>
                                            <option value={"yes"}>Yes</option>
                                            <option value={"no"}>No</option>
                                          </select>
                                        </div>
                                        {leadInput.length > 0 &&
                                        leadInput
                                          ?.filter(
                                            (h) => h?.userId === team?.id
                                          )
                                          .find(
                                            (h) => h?.requirement === "yes"
                                          ) ? (
                                          <div className="p-1">
                                            {/* {console.log("check filter of userid",leadInput.find(h=>h?.userId===team?.id))} */}
                                            <input
                                              name="position"
                                              type="number"
                                              min={0}
                                              max={remainingPositions}
                                              // value={leadInput[index]?.position}
                                              className="w-28"
                                              onChange={(e) =>
                                                handleInputChange(e, index, {
                                                  teamId: team?.id,
                                                })
                                              }
                                            />
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          {/* <input type='number' onChange={handleInputChange} className='border p-2 w-full'/> */}
                          <div className="p-2 mx-4 border">
                            <div className="p-1 flex mb-1 px-3 bg-gray-200 justify-between">
                              <span>Number of Position Left</span>
                              <span>{remainingPositions}</span>
                            </div>
                            <div className="p-1 flex bg-gray-200 px-3  justify-between">
                              <span>Total Positions</span>
                              <span>{numberOfPosition}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2 px-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();

                      if (totalPosition > numberOfPosition) {
                        toast.error(
                          `Press Number less than Remaining Positions!`
                        );

                        console.log("fire");
                      } else {
                        const newLeadInput =
                          leadInput &&
                          leadInput
                            ?.filter((x) => x?.position > 0)
                            ?.map((y) => y);
                        console.log("lead input", newLeadInput);
                        if (remainingPositions === 0) {
                          try {
                            const formdata = new FormData();
                            formdata.append("job_id", jobId);
                            formdata.append("jobrecruitment_id", rowId);
                            for (let i = 0; i < newLeadInput.length; i++) {
                              formdata.append(
                                `jobassigns[${i}][user_id]`,
                                `${newLeadInput[i]?.userId}`
                              );
                              formdata.append(
                                `jobassigns[${i}][no_of_possition]`,
                                `${newLeadInput[i]?.position}`
                              );
                            }
                            const request = await axios.postForm(
                              `${process.env.REACT_APP_API_URL}lead/assignlead`,
                              formdata,
                              {
                                headers: {
                                  Authorization: `Bearer ${accessToken}`,
                                  Accept: "application/json",
                                },
                              }
                            );
                            const response = await request?.data;
                            if (response?.code === 200) {
                              toast.success(`${response?.message}`);
                              setShowModal(false);
                              setRowId("");
                              getErfLeads();
                            }
                          } catch (error) {
                            console.log("error", error);
                            if (error?.response?.data?.error) {
                              const errors = Object.values(
                                error?.response?.data?.error
                              );
                              console.log("Errors", errors);
                              errors.map((x) => toast.error(`${x}`));
                            }
                            if (error?.response?.data?.message) {
                              if (error?.response?.data?.error) {
                                const errors = Object.values(
                                  error?.response?.data?.error
                                );
                                console.log("Errors", errors);
                                errors.map((x) => toast.error(`${x}`));
                              }
                              if (error?.response?.data?.message) {
                                toast.error(
                                  `${error?.response?.data?.message}`
                                );
                              }
                            }
                          }
                        } else {
                          toast.warn(`Kindly assign all positions.!`);
                        }
                      }
                    }}
                  >
                    Assign Here
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {showEdit ? (
        <EditErfData data={rowData} setShowAddModal={setShowEdit} />
      ) : null}
      <div className="p-2">
        <div className="p-2 bg-white border-t-2 border-primary">
        <BackButton route="/admin/newerf"/>
          <h2 className="text-xl px-2 border-gray-300">Project</h2>
          <div className="grid grid-cols-3 ">
            {filteredData1 &&
              filteredData1?.map((x, index) => (
                <div className="col-span-1 w-full p-2" key={index}>
                  <label className="text-sm text-primary font-medium">
                    {x.title}
                  </label>
                  <span className="block text-gray-700">{x.data}</span>
                </div>
              ))}
          </div>
        </div>
        {localData &&
        localData?.data?.userPermissions?.find((x) =>
          x?.includes("add_category")
        ) ? (
          
          <div className="p-2 bg-white mt-4 border-t-2 px-4 border-primary">
            <h2 className="text-xl border-gray-300">MRF List</h2>
            <div>
              <div className="py-4 border-t">
                <div>
                  {/* <h3>Name <span className='px text-red-500'>*</span></h3> */}
                  <input
                    type="text"
                    className="p-1 border-b border-gray-300"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div></div>
                </div>
              </div>
              <div className=" lg:p-1.5  pb-6 w-full">
                <div className="overflow-hidden text-[14px]">
                  <Table data={filteredData} columns={tableHeading} 
               noDataComponent={<CustomNoDataComponent data={ "There's no Mrf this Pid "}/>}

                  />
                 
                </div>
              </div>
            </div>
          </div>
         ) : null} 
      </div>
      </div>
    </>
  );
};

export default ViewNewErf;
