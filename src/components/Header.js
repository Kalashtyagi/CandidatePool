import React, { useState } from "react";
import { BiBell, BiPowerOff } from 'react-icons/bi';
import { HiBars3 } from 'react-icons/hi2';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import userLogo from '../assets/60111.jpg';
import bg from "../assets/bg_sidebar.jpg";

Modal.setAppElement('#root');

const Header = ({ setShowSideBar, showSideBar }) => {
  const navigate = useNavigate();
  const localData = JSON?.parse(localStorage.getItem('data'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('data');
    navigate('/');
  };

  return (
    <div style={{
      backgroundImage: `url('https://www.shutterstock.com/image-illustration/abstract-smooth-dark-blue-black-260nw-556465648.jpg')`, 
      backgroundImage: `url(${bg})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      <div className={`z-50 border-white sticky inset-x-0 top-0 overflow-visible lg:border-white ${showSideBar ? "lg:border-l-[0.5px] delay-200 duration-200" : ""} w-full`}>
        <div className="h-16 px-4 flex items-center border-b border-gray-200 justify-between">
          <div className="">
            <HiBars3
              size={40}
              className="px-2 cursor-pointer text-white hover:text-sky-500"
              onClick={() => setShowSideBar(!showSideBar)}
            />
          </div>
          <div className="flex items-center text-white">
            <img src={localData?.data?.profile_image_url} className="rounded-full w-10 h-10" />
            <span className="px-2 hover:text-sky-500 cursor-pointer">{localData?.data?.name}</span>
            {/* <BiBell size={40} className="px-2 cursor-pointer hover:text-sky-500" /> */}
            <BiPowerOff size={40} className="px-2 cursor-pointer hover:text-sky-500" onClick={openModal} />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Logout Confirmation"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: {
            backgroundColor: '#103f59',
            color: 'white',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            maxWidth: '400px',
            inset: 'auto',
            height: '200px'
          }
        }}
      >
        <h2>Logout Confirmation</h2>
        <p>Are you sure you want to logout?</p>
        <div className="flex justify-around mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
