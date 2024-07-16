import React, { useEffect, useState } from 'react';
import ErfNewForm from './ErfNewForm';
import ErfGroup from './ErfGroup';
import axios from 'axios';

const Index = () => {
  const [editErfData, setEditErfData] = useState('');
  const [erfData, setErfData] = useState([]);
  const localData = JSON.parse(localStorage.getItem('data'));
  const [selectedRadio, setSelectedRadio] = useState('onsite');



  
  const createNewErf = async (newErfData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}erf-list`, newErfData, {
        headers: {
          Authorization: `Bearer ${localData?.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const responseData = response.data;
      console.log('New ERF created:', responseData);
      
      // getErfData();
    } catch (error) {
      console.error('Error creating new ERF:', error);
    }
  };
  return (
    <div className="w-full p-2 overflow-y-auto max-h-[calc(100vh-50px)]">
      <div className="lg:p-1.5 pb-6 pt-2 w-full inline-block align-middle">
        <div className="grid grid-cols-1">
         
        
            <div className="col-span-1 mt-4 lg:col-span-2 border border-primary p-3 bg-white h-fit min-h-52 rounded-sm border-t-4 shadow">
              <ErfGroup setEditErfData={setEditErfData} erfList={erfData}  selectedRadio={selectedRadio}setSelectedRadio={setSelectedRadio} />
            </div>
         
        </div>
      </div>
    </div>
  );
};

export default Index;
