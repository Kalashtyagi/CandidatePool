const localData = JSON.parse(localStorage.getItem("data"));

export const hasPermission = (permission)=>{
    return localData?.data?.userPermissions?.includes(permission);
  }