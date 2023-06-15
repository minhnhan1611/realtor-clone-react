import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.css';
import { FaShareSquare, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Listing() {

    const auth = getAuth();
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
        //console.log(listing);
    }, [params.listingId])

    if (loading) {
        return <Spinner />
    }

    return (
        <main>
            <Swiper
                slidesPerView={1}
                navigation
                pagination={{ type: "progressbar" }}
                effect='fade'
                modules={[EffectFade]}
                autoplay={{
                    delay: 3000
                }}>
                {listing.imgUrls.map((data, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="relative w-full overflow-hidden h-[400px]"
                            style={{
                                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                backgroundSize: "cover",
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div onClick={() => {
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)
            }} className='fixed top-[10%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center'>
                <FaShareSquare className='text-lg text-slate-500' />
            </div>
            {shareLinkCopied && <p onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied successfully!")
            }} className='m-4 fixed top-[16%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2 cursor-pointer hover:opacity-90 hover:border-gray-600 transition ease-in-out active:border-gray-700'>Link Copy</p>}
            <div className='flex mt-6 flex-col md:flex-row max-w-7xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
                <div className='w-full'>
                    <p className='text-2xl font-bold mb-3 text-sky-900'>
                        {listing.name} - ${listing.offer
                            ? listing.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : listing.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent" ? " / month" : ""}
                    </p>
                    <div className='flex items-center mt-6 mb-3 space-x-1'>
                        <MdLocationOn className='h-4 w-4 text-green-600' />
                        <p className='font-semibold text-sm'>{listing.address}</p>
                    </div>
                    <div className='flex justify-start items-center space-x-4 w-[75%]'>
                        <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold sh'>{listing.type === "rent" ? "Rent" : "Sale"}</p>
                        {listing.offer && (
                            <p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md'>${+listing.regularPrice - +listing.discountedPrice} discount</p>
                        )}
                    </div>
                    <p className='mt-3 mb-3'>
                        <span className='font-semibold'>Description - </span>
                        {listing.description}
                    </p>
                    <ul className='flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6'>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaBed className='text-lg mr-1' />
                            {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaBath className='text-lg mr-1' />
                            {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaParking className='text-lg mr-1' />
                            {listing.parking ? "Parking spot" : "No Parking"}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaChair className='text-lg mr-1' />
                            {listing.furnished ? "Furnished" : "Not furnished"}
                        </li>
                    </ul>
                    {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                        <div className='mt-6'>
                            <button onClick={() => setContactLandlord(true)} className='px-7 py-3 bg-sky-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-sky-700 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out'>Contact Landlord</button>
                        </div>
                    )}
                    {contactLandlord && (
                        <Contact userRef={listing.userRef} listing={listing} />
                    )}
                </div>
                <div className='w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2'>
                    <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </main >
    )
}
