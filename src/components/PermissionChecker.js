

import React, { useEffect, useState } from 'react';

const PermissionChecker = ({ permission,token,state }) => {
  // Determine if the checkbox should be checked based on the presence of permission_role
  const isChecked = !!permission?.permission_role?.role_id;
  
  const [checked, setChecked] = useState(isChecked);

  const handleCheckboxChange = async (e) => {
    const assignPermission = e.target.checked ? 1 : 0;
    setChecked(e.target.checked);
    // Update permission in backend if needed
    try {
      await fetch(`${process.env.REACT_APP_API_URL}role-permission/assign`, {
        method: "post",
        headers: {
          'Authorization': `${token}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          permission_id: permission.permission_id,
          role_id: state.id,
          assignPermission: assignPermission,
        })
      });
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <span>{permission.permission_display_name}</span>
    </div>
  );
};

export default PermissionChecker;
