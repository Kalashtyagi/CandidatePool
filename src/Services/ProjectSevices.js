import axios from "axios";
const APIURL = process.env.REACT_APP_API_URL

const jsonData = JSON.parse(localStorage.getItem("data"));
const accessToken = jsonData && jsonData?.access_token;
const authorize = "Bearer" + " " + accessToken;

export const getAllMrf=async()=>{
    try{
        const response=await axios.get(`${APIURL}jobs/erf`,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`${authorize}`
            }
        })
        console.log("Hello",response)
        if(response?.status==200){
            const data=response?.data?.data
            console.log("serviceData",data)
            return data;
        }
    }catch(error){
         console.log(error);
         throw error
    }
}
export const getAllHod=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}team/ishod`,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`${authorize}`
        }
      })
      if(response?.status===200){
        const data=await response?.data?.data
        return data;
        // const data=await response?.data?.data;
        // setAllHodData(data);
      }

    }catch(error){
      console.log(error);
      throw error;
    }
  }
  export const getAllProjectLead=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}team/isprojectlead`,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`${authorize}`
        }
      })
      if(response?.status===200){ 
        const data=await response?.data?.data;
        return data;
        // const data=await response?.data?.data;
        // setAllProjectLead(data);
      }

    }catch(error){
      console.log(error);
    }
  }

 export  const getCategory=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_API_URL}jobcategories`,{
        headers:{
          Authorization:`${authorize}`,
          "Content-Type":"application/json"



        }
      })
      console.log("Respinse",response);
      if(response?.status==200){
        const data=await response?.data?.data;
        return data;
        // setAllCategory(data);
      }

    }catch(error){
      console.log(error);

    }
  }

// export const 