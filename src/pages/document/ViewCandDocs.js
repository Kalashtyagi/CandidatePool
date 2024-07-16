import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import BackButton from "../../components/BackButton";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loader-spinner";


export const ViewCandDocs = () => {
    const { state ,page} = useLocation();
    const [documents, setDocuments] = useState([]);
    const [isDocument, setIsDocument] = useState(false);
    console.log("Page",state?.page)
    console.log(state)

    const jsonData = JSON.parse(localStorage.getItem("data"));
    const accessToken = jsonData?.access_token;
    const authorize = "Bearer" + " " + accessToken;
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDocId, setLoadingDocId] = useState(null);

    const getDocuments = async () => {
        setIsDocument(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}candidate/${state?.row?.Id}/documents`, {
                headers: {
                    Authorization: `${authorize}`,
                    "Content-Type": "application/json",
                }
            });
            if (response?.status == 200) {
                const data = await response?.data?.data;
                setDocuments(data);
                setIsDocument(false);
            }

        } catch (error) {
            console.log(error);
            setIsDocument(false);
        }
    };
    const PccVerify=async(Id,docId,is_verified)=>{
        try{
            setIsLoading(true);
        setLoadingDocId(docId)
            const response=await axios.post(`${process.env.REACT_APP_API_URL}pcc/update/${Id}/${docId}`,{is_verified:is_verified},{
                headers: {
                    Authorization: `${authorize}`,
                    "Content-Type": "application/json",
                }, 
            })
            if (response?.status == 200) {
                getDocuments();
                
                toast.success(`${response?.data?.message}`)
                setIsLoading(false);
            }
        }catch(error){
            console.log(error);
            setIsLoading(false);
        }finally{
            setIsLoading(false);
        }
    }

    const verifyDocument = async (Id, docId, is_verified) => {
        
        if(state?.page=="pcc"){
            PccVerify(Id,docId,is_verified);
        }
        else{
            try {
                setIsLoading(true);
        setLoadingDocId(docId)
                const response = await axios.post(`${process.env.REACT_APP_API_URL}document/update/${Id}/${docId}`, { is_verified: is_verified }, {
                    headers: {
                        Authorization: `${authorize}`,
                        "Content-Type": "application/json",
                    },
    
                });
                console.log(response);
                if (response?.status == 200) {
                    getDocuments();
                    toast.success(`${response?.data?.message}`)
                }
    
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
            finally {
                setIsLoading(false);
                setLoadingDocId(null);
            }

        }
       
    };

    useEffect(() => {
        getDocuments();
    }, []);

    return (
        <div className="p-8  bg-gray-100 min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
            <ToastContainer autoClose={3000} position="top-right" />
            <BackButton route={-1} />
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Candidate Documents</h1>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
                <div>
                    <h2 className="text-2xl font-bold mb-4">{state?.row?.Name}</h2>
                    <p className="mb-2"><span className="font-semibold">Phone Number:</span> {state?.row?.PhoneNumber}</p>
                    <p className="mb-2"><span className="font-semibold">Email:</span> {state?.row?.EmailId}</p>
                    <p className="mb-2"><span className="font-semibold">Qualification:</span> {state?.row?.UnderGraduationDegree} in {state?.UGSpecialization}</p>
                    <p className="mb-2"><span className="font-semibold">Address:</span> {state?.row?.PermanentAddress || "Not provided"}</p>
                    <p className="mb-2"><span className="font-semibold">Job Title:</span> {state?.row?.JobTitle}</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Documents</h2>
                    {isDocument ? <div className=" flex justify-center items-center ">
          <Circles color="#00BFFF" height={50} width={50} />
        </div> 
                   : <ul className="list-none p-0">
                        {documents && documents.length > 0 ? (
                            <div className="overflow-y-auto max-h-[calc(110vh-150px)] scrollbar-custom">
                                {documents && documents.length > 0 && documents.map((doc, index) => (
                                    <li key={index} className="mb-4 p-4 bg-gray-50 rounded shadow">
                                        <p className="mb-2"><span className="font-semibold">{doc.name}:</span></p>
                                        {doc?.url ? (
                                            <a className="text-blue-500 mb-2 block" href={doc.url} target="_blank" rel="noopener noreferrer">View Document</a>
                                        ) : (
                                            <span className="text-red-500 mb-2 block">Not uploaded</span>
                                        )}
                                        <div className="flex space-x-2">
                                            {doc?.is_verified != 0 && (
                                                <button
                                                    className={`py-1 px-3 rounded ${doc.is_verified == 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                                    onClick={() => verifyDocument(state?.row?.Id, doc?.id, 1)}
                                                    disabled={doc.is_verified}
                                                >
                                                    {isLoading && loadingDocId == doc?.id ? (<>
                                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                                    </>) : (doc.is_verified == 1 ? "Verified" : "Verify")}
                                                </button>

                                            )}

                                            {doc.is_verified != 1 && (
                                                <button
                                                    disabled={doc?.is_verified == 0}
                                                    className={`py-1 px-3 rounded ${!doc.is_verified ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                                    onClick={() => verifyDocument(state?.row?.Id, doc?.id, 0)}
                                                >
                                                    {isLoading && loadingDocId === doc?.id ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                                        </>
                                                    ) : (
                                                        doc.is_verified === 0 ? "Not Verified" : "Not Verify"
                                                    )}                                        </button>

                                            )}

                                        </div>
                                    </li>
                                ))}

                            </div>



                        ) : (
                            <div>
                                <span className="text-red-400">There's no document uploaded</span>
                            </div>

                        )}
                    </ul>}


                </div>
            </div>
        </div>
    );
};
