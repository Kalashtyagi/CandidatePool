import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTag } from 'react-icons/fa';
import Table from '../../../../components/Table';
import Modal from './Modal'; 
import AssignPermission from './AssignPermission'; 
import { Circles } from 'react-loader-spinner';

const RolesAndPermission = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState('');
  const [assignPermissionKey, setAssignPermissionKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignPermissionRole, setAssignPermissionRole] = useState(null);
  const[loading,setLoading] = useState(false);
  const selectRole = useSelector((state) => state.roles);
  const getData = localStorage.getItem("data");
  const jsonData = JSON.parse(getData);

  const data = JSON.parse(localStorage.getItem('data'));
  const token = 'Bearer ' + data?.access_token;

 
  const getRoles = async () => {
    try{
      setLoading(true);
      const rolesRequest = await fetch(`${process.env.REACT_APP_API_URL}role`, {
        headers: {
          'Authorization': `${token}`,
          "Content-type": "application/json; charset=UTF-8",
        }
      });
      const rolesResponse = await rolesRequest.json();
      if (rolesResponse) {
        setRoles(rolesResponse?.data);
      }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleSubmit = async () => {
    if (roleId) {
      await fetch(`${process.env.REACT_APP_API_URL}role/update/${roleId}`, {
        method: "POST",
        headers: {
          'Authorization': `${token}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          name: `${newRoleName}`
        })
      });
    } else {
      await fetch(`${process.env.REACT_APP_API_URL}role/store`, {
        method: "POST",
        headers: {
          'Authorization': `${token}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          name: `${newRoleName}`
        })
      });
    }
    getRoles();
    setIsModalOpen(false);
  };

  const tableHeading = [
    {
      name: 'Role',
      selector: row => row.display_name,
      sortable: false,
    },
    {
      name: 'Action',
      selector: row => (
        <div className='flex justify-center space-x-4'>
          {/* Assign Permission Button */}
          <div className='group flex items-center'>
            <button
              title='Assign Permission'
              onClick={() => {
                setAssignPermissionRole(null);
                setAssignPermissionRole(row);
                setAssignPermissionKey(prevKey => prevKey + 1);
              }}
              className='relative text-center rounded-sm bg-blue-500 text-white px-1 py-1 transition duration-300 hover:bg-blue-600'
            >
              <div className="group no-underline cursor-pointer relative inline-block text-center">
                <FaTag className='text-white ' />
                <div className="opacity-0 w-28 bg-gray-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                  Assign Permission
                </div>
              </div>
            </button>
          </div>
          
          {/* Edit Name Button */}
          <div className='group flex items-center'>
            <button
            title='Edit Role'
              onClick={(e) => {
                e.preventDefault();
                setNewRoleName(row?.name);
                setRoleId(row?.id);
                setIsModalOpen(true);
              }}
              className='relative text-center rounded-sm bg-green-500 text-white px-1 py-1 transition duration-300 hover:bg-green-600'
            >
              <div className="group no-underline cursor-pointer relative inline-block text-center">
                <FaPencilAlt className='text-white ' />
                <div className="opacity-0 w-28 bg-gray-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 px-3 pointer-events-none">
                  Edit Name
                </div>
              </div>
            </button>
          </div>
        </div>
      ),
      sortable: false,
    }
  ];

  const filteredData = roles && roles?.filter((data) => data?.name?.toLowerCase().includes(search));

  return (
    <div className='w-full p-4'>
      <div className="lg:p-1.5 pb-6 pt-2 w-full inline-block align-middle">
        <div className='grid lg:grid-cols-8 grid-cols-8 gap-4'>
          <div className='col-span-3 lg:col-span-3 border border-primary p-3 bg-white rounded-sm border-t-4 shadow'>
            <h2 className='text-xl border-gray-300'>Role List</h2>
            <div className='flex justify-between'>
              <input
                type="text"
                className="p-1 border-b border-gray-300"
                placeholder='Search...'
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="px-4 py-2 cursor-pointer  hover:bg-gray-800 bg-[#103f59] text-white rounded-sm"
                onClick={() => {
                  setNewRoleName('');
                  setRoleId('');
                  setIsModalOpen(true);
                }}
              >
                Add Role
              </button>
            </div>
            {loading?(
              <div className="flex justify-center items-center ">
              <Circles color="#00BFFF" height={80} width={80}/>
              </div>
            ):(
              <>
               <div className='lg:p-1.5 pb-6 w-full'>
              <div className="overflow-y-auto max-h-[calc(100vh-150px)] overflow-hidden text-[14px] scrollbar-custom">
                <Table data={filteredData} columns={tableHeading} />
              </div>
            </div>
              </>
            )}
           
          </div>
          <div className='col-span-5 border border-primary p-3 bg-white rounded-sm border-t-4 shadow'>
            {assignPermissionRole ? (
              <AssignPermission key={assignPermissionKey} role={assignPermissionRole} token={token} />
            ) : (
              <div>Select a role to assign permissions</div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className='text-xl border-gray-300 mb-4'>Role</h2>
          <form>
            <div className='py-4 border-t border-b'>
              <div>
                <h3>Name <span className='px text-red-500'>*</span></h3>
                <input
                  required
                  type="text"
                  value={newRoleName || ""}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="p-2 border rounded border-gray-300 w-full"
                />
              </div>
            </div>
            <div className='flex py-2 justify-end'>
              <input
                type="submit"
                value={"Save"}
                className="px-4 py-2 cursor-pointer hover:bg-gray-800 bg-primary text-white rounded-sm"
                onClick={async (e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RolesAndPermission;