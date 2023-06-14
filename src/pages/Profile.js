import { getAuth, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Profile() {

    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false);
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
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

    // Cập nhập lại tên người dùng
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

    // Hiển thị listing theo user.id
    useEffect(() => {
        async function fetchUserListings() {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
            const querySnap = await getDocs(q);
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(listings);
            setLoading(false);
        }
        fetchUserListings();
    }, [auth.currentUser.uid])

    // Xóa listingItem
    async function onDelete(listingID) {
        if (window.confirm("Are you sure, you want to delete?")) {
            await deleteDoc(doc(db, "listings", listingID));
            const updatedListings = listings.filter((listing) => listing.id !== listingID);
            setListings(updatedListings);
            toast.success("Successfully deleted the listing");
        }
    }

    // Chỉnh sữa và cập nhập listingItem
    function onEdit(listingID) {
        navigate(`/edit-listing/${listingID}`)
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
            <div className='max-w-7xl px-3 mt-6 mx-auto'>
                {!loading && listings.length > 0 && (
                    <>
                        <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
                        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-col-5 mt-6 mb-6'>
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    id={listing.id}
                                    listing={listing.data}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)} />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    )
}
