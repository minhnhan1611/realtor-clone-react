import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {

    const [pageState, setPageState] = useState("Sign in")
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState("Profile")
            } else {
                setPageState("Sign in")
            }
        })
    }, [auth])

    function pathMatchRoute(route) {
        if (route === location.pathname) {
            return true;
        }
    }

    return (
        <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
            <header className='flex justify-between items-center px-3 py-3 max-w-7xl mx-auto'>
                <div className="w-24">
                    <img onClick={() => { navigate("/") }} className='w-[100%] h-auto cursor-pointer' src='https://dgs.net.vn/wp-content/uploads/2017/06/logo-nganh-bat-dong-san-401.jpg' alt='logo' />
                </div>
                <div>
                    <ul className='flex space-x-10'>
                        <li onClick={() => { navigate("/") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "!text-black !border-b-red-500"}`}>Home</li>
                        <li onClick={() => { navigate("/offers") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers") && "!text-black !border-b-red-500"}`}>Offers</li>
                        <li onClick={() => { navigate("/profile") }} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "!text-black !border-b-red-500"}`}>
                            {pageState}
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    )
}
