import axios from "axios";


const APIURL = process.env.REACT_APP_API_URL

const jsonData = JSON.parse(localStorage.getItem("data"));
const accessToken = jsonData && jsonData?.access_token;
const authorize = "Bearer" + " " + accessToken;


export const getAllStatus = async () =>{
    try{
        const response = await axios.get(`${APIURL}candidate/status`,{
            headers:{
                Authorization:`${authorize}`
            }
        })
        if(response?.status === 200){
            return response;
                
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}
let id
export const searchCandidates = async (payload,tab) => {
    if(tab=="round 1"){
        id=3
        
    }else{
        id=4
    }
    try {
     

      const searchApiData = await axios.post(`${APIURL}candidates/SearchCandidates`,{MRFId:payload,status_id:id},{
        headers: {
          'Authorization': `${authorize}`
        }
      });

      if (searchApiData?.status === 200) {
        const apiResponse = searchApiData?.data?.data?.candidates;
        console.log("apirespose",apiResponse)

        return apiResponse;
        // setCandidateData(apiResponse);
        // const totalRows = searchApiData?.data?.data?.total_candidates; 
        // setPaginationOptions(prev => ({
        //   ...prev,
        //   totalRows: totalRows,
        //   nextPageUrl: null, 
        //   prevPageUrl: null,
        // }));
      } else {
        // setCandidateData([]);
      }
    } catch (error) {
        return []
      console.log(error);
    //   toast.error(error?.response?.data?.message)
    } finally {
    //   setLoading(false);
    }
  };

export const DashboardInsights = async () =>{
  try{
    const response = await axios.get(`${process.env.REACT_APP_API_URL}getDashboardInsights`,{
      headers:{
        'Authorization': `${authorize}`,
        'Content-Type':'application/json'
      }
     
    })
    return response;
  }catch(error){
    console.log(error);
  }


}