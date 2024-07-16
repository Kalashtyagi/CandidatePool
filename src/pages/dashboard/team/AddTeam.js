import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible, AiOutlineHome } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import BackButton from '../../../components/BackButton';

const AddTeam = () => {
    // const [showPassword,setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm();
    const[isLoading,setIsLoading]=useState(false);
    const onSubmit = async(data) => { 
        setIsLoading(true);
             try {
            const formData = new FormData()
            formData.append('name', data?.name)
            formData.append('email', data?.email)
            formData.append('password',data?.password)
            formData.append('mobile', data?.mobile)
            formData.append('role_id', data?.role_id)
            formData.append('ishod', ishod)
            formData.append('isprojectlead', isprojectlead)
           
            if (file) {
                formData.append('image', file)
            }
            const request = await axios.postForm(`${process.env.REACT_APP_API_URL}team/store`, formData, {
                headers: {
                    'Authorization': `${authorize}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'js'
                }
            })
            const response = await request?.data
            if (response.code === 200) {
                toast.success(`${response?.message}`)
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/admin/team')
                }, 4000)
                clearTimeout()
            }
        } catch (error) {
            console.log('error', error)
            setIsLoading(false);
            if (error?.response?.data?.error) {
                const errors = Object.values(error?.response?.data?.error)
                console.log('Errors', errors)
                errors.map((x) => (
                    toast.error(`${x}`)
                ))
            }
            if (error?.response?.data?.message) {
                if (error?.response?.data?.error) {
                    const errors = Object.values(error?.response?.data?.error)
                    console.log('Errors', errors)
                    errors.map((x) => (
                        toast.error(`${x}`)
                    ))
                }
                if (error?.response?.data?.message) {
                    toast.error(`${error?.response?.data?.message}`)
                }
            }
        }
        
        console.log("foemf", data);
    }

    const [roleList, setRoleList] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [file, setFile] = useState()
    const [role, setRole] = useState('')
    const navigate = useNavigate()
    const [ishod, setIsHod] = useState(0);
    const [isprojectlead, setIsProjectLead] = useState(0);

    const handleCheckboxChange = () => {
        setIsHod(ishod === 0 ? 1 : 0);
    };
    const handleProjectLead = () => {
        setIsProjectLead(isprojectlead == 0 ? 1 : 0);
    }
    console.log(ishod)


    const jsonData = JSON.parse(localStorage.getItem('data'));
    const accessToken = jsonData && jsonData?.access_token;
    const authorize = "Bearer" + " " + accessToken;
    const location = useLocation()

    const getRoleApi = async () => {
        const request = await fetch(`${process.env.REACT_APP_API_URL}role`, {
            method: 'get',
            headers: {
                'Authorization': `${authorize}`,
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const response = await request.json()
        setRoleList(response?.data)
        console.log("Reponse", roleList)
    }

    useEffect(() => {
        getRoleApi()
    }, [])

    useEffect(() => {
        if (jsonData?.data?.userPermissions.find(a => a === "add_team")) {
            return
        } else {
            navigate('/admin')
        }
    }, [location])

  

    return (
        <>
            <ToastContainer position='top-right' />
            <div className='p-4'>
                <BackButton route="/admin/team"/>
                <div className="md:grid md:grid-cols-3 md:gap-6 py-4">
                    <div className="mt-5 md:mt-0 md:col-span-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="shadow sm:rounded-md sm:overflow-hidden scrollbar-custom">
                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6">
                                        <div className="md:grid md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                            <label htmlFor="company_website" className="block text-sm font-medium text-gray-700">
                                                Name <span className='text-red-400'>*</span>
                                            </label>
                                            <input onChange={(e) => setName(e.target.value)} type="text" className="w-full shadow appearance-none border rounded w-auto py-1 px-1 text-black"
                                                {...register("name", {
                                                    required: "Name is required",
                                                    pattern: {
                                                        value: /^[A-Za-z\s]+$/,
                                                        message: "Only alphabetical characters are allowed",
                                                    },
                                                })}
                                                // error={Boolean(errors.name)}
                                            />
                                            {errors.name && (
                                                <span className="text-red-500 text-sm">{errors.name.message}</span>
                                            )}
                                        </div>
                                        <div className="md:grid md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                            <label htmlFor="company_website" className="block text-sm font-medium text-gray-700">
                                                Email <span className='text-red-400'>*</span>
                                            </label>
                                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full shadow appearance-none border rounded max-w-3xl py-1 px-1 text-black"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value:
                                                            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                                                        message: "Enter a valid email address",
                                                    },
                                                })}
                                                error={Boolean(errors.email)}

                                            />
                                            {errors.email && (
                                                <span className="text-red-500 text-sm" >{errors.email.message}</span>
                                            )}
                                        </div>
                                        <div className="md:grid w-full md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                            <label htmlFor="company_website" className="block text-sm font-medium text-gray-700">
                                                Password <span className='text-red-400'>*</span>
                                            </label>
                                            <div className='flex w-full items-center shadow'>
                                                <input type={showPassword ? "text" : "password"} className=" appearance-none border w-full border-r-0 rounded-r-none rounded py-1 px-1 text-black"
                                                    {...register("password", {
                                                        required: "Password is required",
                                                        pattern: {
                                                            value: /^(?=.*\d{6,}).{6,}$/,
                                                            message: "Password must contain at least 6 digits"
                                                        },
                                                    })}
                                                    error={Boolean(errors.password)}
                                                />
                                               
                                                <span className='rounded rounded-l-none border cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                                    {
                                                        showPassword ?
                                                            <AiFillEyeInvisible className='text-[29px] p-[3px]' />
                                                            :
                                                            <AiFillEye className='text-[29px] p-[3px]' />
                                                    }
                                                </span>
                                            </div>
                                            {errors.password && (
                                                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                                                )}
                                            {/* <span className="help-block"> (length: min-6 Character)</span> */}
                                        </div>
                                        <div className="md:grid md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                            <label htmlFor="company_website" className="block text-sm font-medium text-gray-700">
                                                Phone <span className='text-red-400'>*</span>
                                            </label>
                                            <input  type="text" className="w-full shadow appearance-none border rounded w-auto py-1 px-1 text-black"
                                                {...register("mobile", {
                                                    required: "Mobile Number is required",
                                                    pattern: {
                                                        value: /^[789]\d{9}$/,
                                                        message: "Please enter a valid Indian mobile number"
                                                    },
                                                })}
                                                error={Boolean(errors.mobile)}
                                            />
                                            {errors.mobile && (
                                                <span className="text-red-500 text-sm">{errors.mobile.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Image
                                            {/* <span className='text-red-400'>*</span> */}
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        {/* <span>Upload a file</span> */}
                                                        <input
                                                            //  required
                                                            onChange={(e) => setFile(e.target.files[0])} type="file" accept='jpg,jpeg,png' className="" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                   
                                    <div className="md:grid md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Role Name <span className='text-red-400'>*</span>
                                        </label>
                                        <select
                                            className="shadow border rounded w-full py-1 px-1 overflow-scroll h-10 text-black"
                                            // onChange={(e) => setRole(e.target.value)}
                                            {...register("role_id", { required: "Role is required" })}
                                        >
                                            <option value="">Choose Role</option>
                                            {roleList && roleList.map((roles) => (
                                                <option value={roles.id} key={roles.id}>{roles.display_name}</option>
                                            ))}
                                        </select>
                                        {errors.role_id && (
                                            <span className="text-red-500 text-sm" >
                                                {errors.role_id.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="md:grid md:grid-cols-2 sm:grid-cols-1 md:gap-1">
                                        <div className="md:grid md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                HOD
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="isHODYes"
                                                    name="isHOD"
                                                    value="yes"
                                                    onChange={handleCheckboxChange}
                                                    checked={ishod === 1}
                                                    className="form-checkbox h-4 w-4 text-indigo-600"
                                                    
                                                />
                                            </div>

                                        </div>
                                        <div className="md:grid md:grid-cols-1 sm:grid-cols-1 md:gap-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Project Leader
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="isProjectLeaderYes"
                                                    name="isProjectLeader"
                                                    value="yes"
                                                    onChange={handleProjectLead}
                                                    checked={isprojectlead === 1}
                                                    className="form-radio h-4 w-4 text-indigo-600"
                                                />
                                            </div>

                                        </div>
                                    </div>

                        
                    </div>
                    <div className="px-4 py-3 bg-white text-right sm:px-6">
                        <button  type="submit"className=" w-35 bg-[#103f59] text-white active:bg-[#103f59] font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"

 disabled={isLoading}> 
                         {isLoading? <i className="fas fa-spinner fa-spin mr-2"></i>:"Save"} 
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

        </>
    );
}
export default AddTeam;