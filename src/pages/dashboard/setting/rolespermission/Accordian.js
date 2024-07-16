// import React, { useState } from 'react';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import PermissionChecker from '../../../../components/PermissionChecker';

// const Accordion = ({ module, token, state, openAccordion, setOpenAccordion,rolesPermission }) => {
//   const isOpen = openAccordion === module.module_id
//   ;

//   const toggleAccordion = () => {
//     setOpenAccordion(isOpen ? null : module.module_id
//     );
//   };

//   return (
//     <div className="border-t border-gray-200">
//       <div
//         className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
//         onClick={toggleAccordion}
//       >
//         <div>{module.module_name}</div>
//         <div>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
//       </div>
//       {isOpen && (
//         <div className="bg-white px-4 py-2">
//           <ul className="divide-y divide-gray-200">
//             {module.permissions.map((permission) => (
//               <li key={permission.permission_id
//               } className="flex items-center space-x-2">
//                 <PermissionChecker
//                   permission={permission}
//                   token={token}
//                   state={state}
//                 />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Accordion;

import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PermissionChecker from '../../../../components/PermissionChecker';

const Accordion = ({ module, token, state, openAccordion, setOpenAccordion }) => {
  const isOpen = openAccordion === module.module_id;

  const toggleAccordion = () => {
    setOpenAccordion(isOpen ? null : module.module_id);
  };

  return (
    <div className="border-t border-gray-200">
      <div
        className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
        onClick={toggleAccordion}
      >
        <div>{module.module_name}</div>
        <div>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
      </div>
      {isOpen && (
        <div className="bg-white px-4 py-2">
          <ul className="divide-y divide-gray-200">
            {module.permissions.map((permission) => (
              <li key={permission.permission_id} className="flex items-center space-x-2">
                <PermissionChecker
                  permission={permission}
                  token={token}
                  state={state}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Accordion;
