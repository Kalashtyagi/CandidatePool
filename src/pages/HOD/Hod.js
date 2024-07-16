import React, { useEffect, useState } from 'react'
import { FaEdit, FaRegEdit  } from "react-icons/fa";
import { AiOutlineDelete  } from "react-icons/ai";
import { FiArrowRight } from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import Table from "../../components/Table"
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Select from 'react-select'
import { Circles } from "react-loader-spinner";
import axios from 'axios';

const Hod = () => {
    const [department,setDepartment] = useState('')
    const [showEditDepartment,setshowEditDepartment]= useState('')
    const [showEditButton,setShowEditButton] = useState(false)
    const [showDeleteButton,setShowDeleteButton] = useState(false)
    const [editDepartment,setEditDepartment] = useState('')
    const [contentEdit,setContentEdit] = useState('')
    const [search,setSearch] = useState('')
    const [loading, setLoading] = useState(false);
    const[hodName,setHodName]=useState("")
    const[email,setEmail]=useState('')
    const[mobileno,setMobileNo]=useState('')
    const[departmentName,setDepartmentName]=useState('')
    const[allDepartment,setAllDepartment]=useState('')
    const [departmentList,setDepartmentList]=useState('')
    const[DepartmentId,setDepartmentId]=useState('')
    const [defaultOption, setDefaultOption] = useState(null);



    const data = localStorage.getItem("data");
    const jsonData = JSON.parse(data);
    const accessToken = jsonData && jsonData?.access_token;
    const authorize = "Bearer" + " " + accessToken;
    const getDepartment = async () => {
      setLoading(true);
      const request = await fetch(`${process.env.REACT_APP_API_URL}hod`, {
        method: "GET",
        headers: {
          'Authorization': `${authorize}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const jsonResponse = await request?.json();
      // console.log("department",jsonResponse )
      
      if (jsonResponse) {
        setDepartment(jsonResponse?.data);
      }setLoading(false);
    };
    useEffect(() => {
      getDepartment();
      document.title="CIPLCRM | Department"
    }, [showEditDepartment]);
    console.log("hod",department)

    const departmentApi = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}department`, {
        headers: {
          'Authorization': `${authorize}`
        }
      })
      const result = await response?.data
      if (result?.data.length > 0) {
        setDepartmentList(result)
      }
    }
    useEffect(() => {
      departmentApi()
    }, [])

    const navigate = useNavigate()
    const location = useLocation()
    const handleSelectChange = (selectedOption) => {
      console.log("handleSelectChange",selectedOption)
      setDepartmentId(selectedOption?selectedOption.value:'')
    };
  useEffect(()=>{
    if(jsonData?.data?.userPermissions.find(a=>a === "edit_department"))
    {
      setShowEditButton(true)}
      else{
        setShowEditButton(false)
      }
    (jsonData?.data?.userPermissions.find(a=>a === "delete_department"))?setShowDeleteButton(true):setShowDeleteButton(false)
  },[showEditButton,showDeleteButton])


  // Filter data
  
  const filteredData = department && department?.filter((data)=>data?.Name?.toLowerCase().includes(search))
  
  useEffect(()=>{
    if(jsonData?.data?.userPermissions.find(a=>a === "view_department")){
      return
    }else{
      navigate('/admin')
    }
    
  },[location])
  useEffect(() => {
    const getAlDepartment = async () => {
      setLoading(true);
      try {
        const request = await fetch(`${process.env.REACT_APP_API_URL}department`, {
          method: "GET",
          headers: {
            'Authorization': authorize,
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        const jsonResponse = await request.json();

        if (jsonResponse) {
          setAllDepartment(jsonResponse?.data);
        }
      } catch (error) {
        setAllDepartment([])
        console.error('Failed to fetch departments:', error);
      } finally {
        
        setLoading(false);
      }
    };

    getAlDepartment();
  }, []);

  const getDepartmentName = (departmentId) => {
    const department = allDepartment && allDepartment.find(dept => dept.id === departmentId);
   
    return department ? department.name : 'Unknown';
  };

  const getDepartmentName1 = (departmentId) => {
    const dept = allDepartment?.find(dept => dept.id === departmentId);
    return dept ? { value: dept.id, label: dept.name } : null;
  };

  useEffect(() => {
    if (DepartmentId) {
      const defaultDept = getDepartmentName1(DepartmentId);
      setDefaultOption(defaultDept);
    }
  }, [DepartmentId, allDepartment]);
 
    const tableHeading = [
      {
        name: 'S. No.',
        selector: (row, index) => index + 1,
        sortable: false,
      },
      {
        name: 'Name',
        selector: row => row?.Name,
        sortable: false,
        
      },
      {
        name: 'Email',
        selector: row => row?.Email,
        sortable: false,
        
      },
      {
        name: 'Contact',
        selector: row => row?.MobileNo,
        sortable: false,
        
      },
      {
        name: 'Department Name',
        selector: row => getDepartmentName(row?.DepartmentId),
        sortable: false,
        
      },
      
      {
        name: 'Action',
        selector: row => (
          <>
          {
            showEditButton?
            <button
              onClick={() => {
                setshowEditDepartment(true);
                console.log("row",row)
                setContentEdit(row);
                setHodName(row?.Name);
                setEmail(row?.Email);
                setMobileNo(row?.MobileNo)
                setDepartmentId(row?.DepartmentId)
                // getDepartmentName(row?.DepartmentId)
                console.log("DepartmentId",DepartmentId)
              }}
              className=""
            >
              <FaEdit
                className="bg-gray-800 m-1 w-6 p-1 h-6 hover:cursor-pointer"
                fill="white"
                size={30}
                title='Edit'
              />
            </button>
            :null
          }
          {
            showDeleteButton?
            <button
              className=""
              to="#"
              onClick={async() => {
                Swal.fire({
                  title: 'Are you sure you want to delete this ?',
                  text: "After deleting all related data would be deleted and can not be retrived. So before deleting make sure you have back up of all related data !",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it!',
                  cancelButtonText: 'No, cancel!',
                  reverseButtons: true
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await fetch(`${process.env.REACT_APP_API_URL}hod/${row?.Id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `${authorize}`,
                        "Content-type":
                          "application/json; charset=UTF-8",
                      },
                    }
                    );
                    getDepartment()
                    Swal.fire(
                      'Deleted!',
                      '',
                      'success'
                    )
                  } else if (
                    result.dismiss === Swal.DismissReason.cancel
                  ) {
                    Swal.fire(
                      'Cancelled',
                      '',
                      'error'

                    )
                  }
                })
              }}
            >
              <AiOutlineDelete
                size={30}
                className="bg-gray-800 m-1 w-6 p-1 h-6 hover:cursor-pointer text-white"
                title='Delete'
              />
            </button>
            :null
          }
          </>
        ),
        sortable: false,
      },
    ];

  return (
    <div >
<ToastContainer autoClose={3000} position="top-right"/>
    {showEditDepartment ? (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-2xl font-semibold">Edit HOD</h3>
                <button
                  className="p-1 ml-auto border-0 text-red-500  float-right text-3xl leading-none font-semibold "
                  onClick={() => setshowEditDepartment(false)}
                >
                  <span className=" text-red-500 h-6 w-6 text-xl block ">
                    X
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="py-3 px-1">
                <section className="px-1 mx-4 ">
                  <div className="w-60">
                    <label className="block">
                    <span className="px-1">Name</span>
                      <span className="px text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="rounded border p-2 my-2 px-2 w-full"
                      placeholder=""
                      value={hodName}
                      onChange={(e)=>setHodName(e.target.value)}
                    />
                  </div>
                  <div className="w-60">
                    <label className="block">
                    <span className="px-1">Email</span>
                      <span className="px text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="rounded border p-2 my-2 px-2 w-full"
                      placeholder=""
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                    />
                  </div> <div className="w-60">
                    <label className="block">
                    <span className="px-1">Contact</span>
                      <span className="px text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="rounded border p-2 my-2 px-2 w-full"
                      placeholder=""
                      value={mobileno}
                      onChange={(e)=>setMobileNo(e.target.value)}
                    />
                  </div> 
                  <div className="w-60">
                    <label className="block">
                    <span className="px-1">Department Name</span>
                      <span className="px text-red-600">*</span>
                    </label>
                    <Select
                  name=" DepartmentId"
                   options={departmentList?.data?.map((skill) => ({
                    "value": skill?.id,
                    "label": skill?.name
                  }))}
                  onChange={handleSelectChange}
                  isMulti={false}
                  isClearable
                  className="block lg:w-2/3 w-full py-1 px-1 my-2 rounded-md border "
                  value={defaultOption}

                />
                    
                  </div>
                </section>
              </div>
              {/*footer*/}
              <div className="flex items-center p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 flex items-center"
                  type="button"
                  onClick={async() => {
                    try {
                      const request = await fetch(
                         `${process.env.REACT_APP_API_URL}hod/update/${contentEdit?.Id}`,
                         {
                           method: "post",
                           headers: {
                             Authorization: `${authorize}`,
                             "Content-type": "application/json; charset=UTF-8",
                           },
                           body: JSON.stringify({
                            Name:hodName,
                            Email:email,
                            MobileNo:mobileno,
                            DepartmentId:DepartmentId
                           }),
                         }
                         )
                       const response = await request.json()
                       if(response?.code ===200){
                         toast.success(`${response?.message}`)
                         setshowEditDepartment(false)
                         getDepartment()
                         setDepartmentId('')
                       }
                    } catch (error) {
                      console.log('error', error)
                        if (error?.response?.data?.error) {
                          const errors = Object.values(error?.response?.data?.error)
                          console.log('Errors', errors)
                          errors.map((x) => (
                            toast.error(`${x}`)
                          ))
                        }
                        if (error?.response?.data?.message) {
                          if (error?.response?.data?.error) {
                            const errors = Object.values(error?.response?.data?.error)
                            console.log('Errors', errors)
                            errors.map((x) => (
                              toast.error(`${x}`)
                            ))
                          }
                          if (error?.response?.data?.message) {
                            toast.error(`${error?.response?.data?.message}`)
                          }
                        }
                    }
                  }}
                >
                  Update
                  <FiArrowRight className="text-xl px" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null}
    <div className="mt-4 px-4 border border-gray-300 rounded-lg bg-white mx-4">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-3 flex justify-end pr-2">       
            
            <div className="relative max-w-xs flex items-center justify-end">
              <label htmlFor="hs-table-search" className="px-2">
                Search:
              </label>
              <input
                type="text"
                name="hs-table-search"
                id="hs-table-search"
                className="block w-full p-3 border text-sm border-gray-300 rounded-md "
                placeholder="Search..."
                onChange={(e)=>setSearch(e.target.value.toLowerCase())}
              />
            </div>
          </div>
          {loading ? (
        <div className="flex justify-center items-center h-64">
          <Circles color="#00BFFF" height={80} width={80} />
        </div>
      ) : (
          <div className="lg:p-1.5  pb-6 pt-2 w-full inline-block align-middle overflow-y-auto" style={{ maxHeight: '400px' }}>
            <div className="overflow-hidden border rounded-lg">
              <Table columns={tableHeading} data={filteredData}/>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Hod