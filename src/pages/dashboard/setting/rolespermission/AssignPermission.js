// import React, { useEffect, useState } from "react";
// import Accordion from "./Accordian";
// const AssignPermission = ({ role, token }) => {
//   const [rolesPermission, setRolesPermission] = useState([]);
//   const [openAccordion,setOpenAccordion] = useState(false);
//   const getRolesPermission = async () => {
//     try {
//       const rolesRequest = await fetch(
//         `${process.env.REACT_APP_API_URL}rolePermission/${role.id}`,
//         {
//           headers: {
//             Authorization: `${token}`,
//             "Content-type": "application/json; charset=UTF-8",
//           },
//         }
//       );
//       const rolesResponse = await rolesRequest.json();
//       console.log("resss",rolesResponse);
//       if (rolesResponse?.data?.modules) {
//         setRolesPermission(rolesResponse.data.modules);
//       }
//     } catch (error) {
//       console.error('Error fetching role permissions:', error);
//     }
//   };

//   useEffect(() => {
//     getRolesPermission();
//   }, [role, token]);

//   console.log("role",rolesPermission);

//   return (
//     <div>
//       <h2 className='text-xl border-gray-300 mb-4'>Assign Permission ({role.display_name})</h2>
//       <div className='border-y border-gray-100'>
//         {rolesPermission && rolesPermission.map((module) => (
//           <Accordion key={module.id} module={module} token={token} state={role} setOpenAccordion={setOpenAccordion} openAccordion={openAccordion}rolesPermission={rolesPermission} />
//         ))}
//       </div>
//     </div>
//   );
// };



// export default AssignPermission;

import React, { useEffect, useState } from "react";
import Accordion from "./Accordian";

const AssignPermission = ({ role, token }) => {
  const [rolesPermission, setRolesPermission] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);

  const getRolesPermission = async () => {
    try {
      const rolesRequest = await fetch(
        `${process.env.REACT_APP_API_URL}rolePermission/${role.id}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const rolesResponse = await rolesRequest.json();
      console.log("resss", rolesResponse);
      if (rolesResponse?.data?.modules) {
        setRolesPermission(rolesResponse.data.modules);
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  useEffect(() => {
    getRolesPermission();
  }, [role, token]);

  console.log("role", rolesPermission);

  return (
    <div>
      <h2 className='text-xl border-gray-300 mb-4'>Assign Permission ({role.display_name})</h2>
      <div className='overflow-y-auto max-h-[calc(100vh-150px)] border-y border-gray-100 scrollbar-custom'>
        {rolesPermission && rolesPermission.map((module) => (
          <Accordion 
            key={module.id} 
            module={module} 
            token={token} 
            state={role} 
            setOpenAccordion={setOpenAccordion} 
            openAccordion={openAccordion} 
            rolesPermission={rolesPermission} 
          />
        ))}
      </div>
    </div>
  );
};

export default AssignPermission;


