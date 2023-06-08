import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';


export default function SignIn() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }

    return (
        <section>
            <h1 className='text-3xl text-center mt-6 font-bold'>
                Sign In
            </h1>
            <div className='flex justify-between items-center flex-wrap px-6 py-12 max-w-7xl mx-auto'>
                <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
                    <img className='w-full rounded-2xl'
                        src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
                        alt="key" />
                </div>
                <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                    <form>
                        <input className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type="email" id='email' value={email} onChange={onChange} placeholder='Email address' />
                        <div className='relative mb-6'>
                            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type={showPassword ? "text" : "password"} id='password' value={password} onChange={onChange} placeholder='Password' />
                            {showPassword ?
                                (<AiFillEyeInvisible className='absolute top-3 right-3 text-xl cursor-pointer' onClick={() => setShowPassword(showPassword => !showPassword)} />) :
                                (<AiFillEye className='absolute top-3 right-3 text-xl cursor-pointer' onClick={() => setShowPassword(showPassword => !showPassword)} />)}
                        </div>
                        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                            <p className='mb-6'>Don't have a account?
                                <Link to='/sign-up' className='text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Register</Link>
                            </p>
                            <p>
                                <Link to="/forgot-password" className='text-sky-500 hover:text-sky-700 transition duration-200 ease-in-out'>Forgot Password</Link>
                            </p>
                        </div>
                        <button className='w-full bg-sky-500 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-sky-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-sky-800'
                            type='submit'>Sign In</button>
                        <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-400 after:border-t after:flex-1 after:border-gray-400'>
                            <p className='text-center font-semibold mx-4'>OR</p>
                        </div>
                        <OAuth />
                    </form>
                </div>
            </div>
        </section>
    )
}
