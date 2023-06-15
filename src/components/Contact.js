import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { toast } from 'react-toastify';

export default function Contact({ userRef, listing }) {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getLandlord() {
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Could not get landlord data")
            }
        }
        getLandlord()
    }, [userRef])

    async function onChange(e) {
        setMessage(e.target.value);
    }

    return (
        <>{landlord !== null && (
            <div className='flex flex-col w-full'>
                <p>Contact {landlord.name} for the {listing.name.toLowerCase()}</p>
                <div className='mt-3 mb-6'>
                    <textarea className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-white focus:border-slate-600'
                        name='message' id='message' rows="2" value={message} onChange={onChange}>
                    </textarea>
                </div>
                <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
                    <button className='px-7 py-3 bg-sky-600 text-white rounded text-sm uppercase shadow-md
                        hover:bg-sky-700 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg
                        active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6'
                        type='button'>Send Message</button>
                </a>
            </div>
        )}</>
    )
}
