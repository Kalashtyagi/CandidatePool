import React, { useEffect, useState } from "react";
import Table from "../../../components/Table";
import { FaEye, FaPencilAlt, FaPlusCircle } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import axios from "axios";
import AddErfData from "./AddErfData";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GrStatusGood } from "react-icons/gr";
import { AiFillCloseCircle, AiFillMail } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdArchive, MdDelete } from "react-icons/md";
import { Circles } from "react-loader-spinner";
import { hasPermission } from "../../../components/HasPermission";
import { getCategory } from "../../../Services/ProjectSevices";

const ErfGroup = ({ erfList, getERFList, selectedRadio, setSelectedRadio }) => {
  const localData = JSON.parse(localStorage.getItem('data'));

  const [erfData, setErfData] = useState([])
  const [erfId, setErfId] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [recruitmentType, setRecruitmentType] = useState("");

  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(true);
  const data = JSON.parse(localStorage.getItem("data"));
  console.log("data", data);
  const permission = data && data?.data?.roles[0]?.permissions;
  const [showTable, setShowTable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [editErfData, setEditErfData] = useState('');
  const [allCategory, setAllCategory] = useState([])
  const getErfData = async (selectedRadio) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/${selectedRadio}`, {
        headers: {
          Authorization: `Bearer ${localData?.access_token}`,
          Accept: 'application/json',
        },
      });
      const responseData = response?.data;
      console.log('ERF list', responseData);

      if (responseData?.code === 200) {
        if (localData?.data?.roles[0]?.name === 'admin') {
          setErfData(responseData?.data);
        } else if (localData?.data?.userPermissions?.find((x) => x?.includes('view_candidate'))) {
          setErfData(responseData?.data);
        } else {
          const filterData = responseData?.data?.filter(
            (x) =>
              parseInt(x?.user_id) === parseInt(localData?.data?.id) ||
              x?.jobassigned?.some((y) => parseInt(y?.user_id) === localData?.data?.id)
          );
          setErfData(filterData);
        }
      }
    } catch (error) {
      console.error('Error fetching ERF data:', error);
    }
  };

  const showData = async () => {
    console.log("Selected Radio:", selectedRadio);
    setIsLoading(true);

    try {
      await getErfData(selectedRadio);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    showData();
  }, [selectedRadio]);


  useEffect(() => {
    if (erfList?.length > 0) {
      setErfData(erfList.filter((erf) => erf.recruitment_type === selectedRadio));
    }
  }, [erfList, selectedRadio]);
  useEffect(() => {
    console.log('erfList updated:', erfList);

    const filteredData = erfList.filter((erf) => erf.recruitment_type === selectedRadio);

    console.log('Filtered data:', filteredData);
    setErfData(filteredData);

  }, [erfList, selectedRadio]);



  useEffect(() => {
    if (erfList?.length > 0) {
      setErfData(erfList);
    }
  }, [erfList]);

  console.log("erfdata", erfData);
  const getCategoryData = async () => {
    try {
      const data = await getCategory();
      setAllCategory(data.length > 0 ? data : [])
      console.log("ata", data);
    } catch (error) {
      setAllCategory([])
      console.log(error);
    }
  }
  useEffect(() => {
    getCategoryData();
  }, [])



  const projectList = [
    {
      status: "waiting for approval", color: "green", show: "waiting for approval"
    },
    {
      status: "approved", color: "yellow", show: "Approved"

    },
    {
      status: "disapprove", color: "brown", show: "Reject"

    }
  ]
  const getStatus = (msg) => {
    const find = projectList.find((item) => item.status == msg);
    return find ? find : { show: "Unknown", color: "black" }
  }
  const getCategoryName = (id) => {
    const find = allCategory.find((item) => item.id == id);
    return find?.name ?? "Unknown Category"

  }
  const tableHeading = [

    {
      name: <div className="text-sm font-medium">PID</div>,
      selector: (row) => <p title={row?.pid}>{row?.pid}</p>,
      sortable: false,
      hidden: selectedRadio === "inhouse",
    },
    {
      name: <div className="text-sm font-medium">Project Name</div>,
      selector: (row) => row.project_name,
      sortable: false,
      hidden: selectedRadio === "inhouse",
    },

    {
      name: <div className="text-sm font-medium">Department</div>,
      selector: (row) => (
        <p title={row?.department?.name} className=" capitalize">
          {row.department?.name}
        </p>
      ),
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Category</div>,
      selector: (row) => <div className=" capitalize">{getCategoryName(row?.category_id)}</div>,
      sortable: false,
    },
    {
      name: <div className="text-sm font-medium">Project Status</div>,
      selector: (row) => {
        const { show, color } = getStatus(row?.status)
        return (
          <button style={{
            backgroundColor: color,

            color: 'black',
            padding: '8px 12px',
            borderRadius: '5px',
            minWidth: '120px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
            className="capitalize">
            {show}

          </button>)
      },
      sortable: false,
      // width:"200px"
    },




    {
      name: <div className="text-sm font-medium">Action</div>,
      selector: (row) => (
        <>
          <div className="flex justify-center">

            <>
              {row?.status == "approved" && (

                <div className="group flex items-center">
                  {(hasPermission("add_mrf") && row?.status == "approved") ? (
                    <button onClick={() => navigate("/admin/addMrf", { state: { id: row?.id,recruitment_type:selectedRadio } })}

                    >

                      <div className="relative text-center  rounded-sm">
                        <div className="group no-underline cursor-pointer relative inline-block text-center">
                          <FaPlusCircle
                            size={26}
                            className="hover:bg-white p-1 mr-1 text-xl"
                          />

                          <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                            Add MRF
                          </div>
                        </div>
                      </div>
                    </button>

                  ) : null}
                </div>
              )}
              {hasPermission("view_mrf") && (
                <div className="group flex items-center">
                  <button
                    onClick={() => {
                      navigate("/admin/viewnewerf", { state: row });
                    }}
                  >
                    <div className="relative text-center  rounded-sm">
                      <div className="group no-underline cursor-pointer relative inline-block text-center">
                        <FaEye
                          size={30}
                          className="hover:bg-white p-1 mr-1 text-xl"
                        />
                        <div className="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                          View MRF
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

            </>            </div>


        </>
      ),
      sortable: false,
      allowOverflow: true,
      width: "full",
    },
  ];



  const searchTerm = String(search).toLowerCase();

  const filteredData = erfData?.filter(data => {
    if (selectedRadio == "inhouse") {
      const projectName = String(data?.department?.name).toLowerCase();
      return projectName.includes(searchTerm);
    }
    else {
      const projectName = String(data?.project_name).toLowerCase();
      return projectName.includes(searchTerm);
    }


  });

  console.log('507', filteredData);


  return (
    <div className="relative ">
      <ToastContainer autoClose={3000} position="top-right" />
      {showAddModal ? (
        <AddErfData
          recruitmentType={recruitmentType}
          setShowAddModal={setShowAddModal}
          erfId={erfId}
        />
      ) : null}
      <div className="flex overflow-y-auto max-h-[calc(100vh-50px)]">
        <h2 className="text-xl border-gray-300">Project List</h2>

        <div className="mx-11 ">
          <label className="mx-2">
            <input
              type="radio"
              value="inhouse"
              checked={selectedRadio === "inhouse"}
              onChange={() => setSelectedRadio("inhouse")}
            />
            <span className='px-1 font-medium text-lg'>Inhouse</span>
          </label>
          <label >
            <input
              type="radio"
              value="onsite"
              checked={selectedRadio === "onsite"}
              onChange={() => setSelectedRadio("onsite")}
            />
            <span className='px-1 font-medium text-lg' >Project</span>
          </label>



        </div>
      </div>

      {isLoading ? (
        <div className=" flex justify-center items-center ">
          <Circles color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
        <>
          <div>
            <div className="py-4 border-t">
              <div>
                <input
                  type="text"
                  className="p-1 border-b border-gray-300"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="lg:p-1.5 pb-6 w-full ">
              <div className="overflow-hidden text-[14px] ">
                <Table data={filteredData} columns={tableHeading.filter(
                  (column) =>
                    !column.hidden || column.name === 'Action'
                )} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ErfGroup;