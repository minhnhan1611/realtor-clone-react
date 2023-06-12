import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';

export default function Profile() {

    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;

    // LogOut function
    function onLogout() {
        auth.signOut();
        navigate("/")
    }

    function onChange(e) {
        setFormData((formData) => ({
            ...formData,
            [e.target.id]: e.target.value
        }))
    }

    async function onSubmit() {
        try {
            // update display name in firebase authentication
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                // update name in firestore
                const docRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(docRef, {
                    name,
                });
            }
            toast.success("Profile detail updated!")
        } catch (error) {
            toast.error("Could not update the profile details")
        }
    }

    return (
        <div>
            <section className='max-w-7xl mx-auto flex justify-center items-center flex-col'>
                <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
                <div className='w-full md:w-[50%] mt-6 px-3'>
                    <form>
                        {/* Name Input */}
                        <input className={`w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}
                            onChange={onChange}
                            type='text'
                            id='name'
                            value={name}
                            disabled={!changeDetail} />

                        {/* Email Input */}
                        <input className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out' type='email' id='email' value={email} disabled />

                        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
                            <p className='flex items-center'>Do you want to change your name?
                                <span onClick={() => {
                                    changeDetail && onSubmit();
                                    setChangeDetail((changeDetail) => !changeDetail)
                                }}
                                    className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
                                    {changeDetail ? "Apply change" : "Edit"}
                                </span>
                            </p>
                            <p onClick={onLogout} className='text-sky-600 hover:text-sky-800 transition duration-200 ease-in-out cursor-pointer'>Sign Out</p>
                        </div>
                    </form>
                    <button className='w-full bg-sky-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-sky-700 
                    transition duration-150 ease-in-out hover:shadow-lg active:bg-sky-800'
                        type='submit'>
                        <Link to="/create-listing" className='flex justify-center items-center'>
                            <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2' />
                            Sell or rent your home
                        </Link>
                    </button>
                </div>
            </section>
        </div>
    )
}
