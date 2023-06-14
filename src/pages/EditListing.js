import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from 'react-router';

export default function EditListing() {

    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    });

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude
    } = formData;

    const params = useParams();

    // Kiểm tra coi listing có thuộc về người đang chỉnh sữa nó hay không
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error("You can't edit this listing");
            navigate("/")
        }
    }, [auth.currentUser.uid, listing, navigate])

    // Lấy data từ dữ liệu về để edit và update
    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setLoading(false);
            } else {
                navigate('/');
                toast.error("Listing does not exist");
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);

    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }

        // Files
        if (e.target.files) {
            setFormData((formData) => ({
                ...formData,
                // khi người dùng chọn vào input có type = file giá trị của e.target.files sẽ được gán vào images trong formData
                images: e.target.files
            }));
        }

        // Text, Boolean, Number
        if (!e.target.files) {
            setFormData((formData) => ({
                ...formData,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Kiểm tra tính hợp lễ đầu vào
        if (+discountedPrice >= +regularPrice) {
            setLoading(false)
            toast.error("Discounted price needs to be less than regular price")
            return;
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error("Maximum 6 images are allowed");
            return;
        }

        // Kiểm tra vị trí của người dùng nhập vào
        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json();
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            if (location === undefined) {
                setLoading(false);
                toast.error("Please enter a correct address")
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        // Tác vụ xử hình ảnh lên storage
        async function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // eslint-disable-next-line default-case
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        }

        // Tác vụ chờ các Promise trả về từ hàm storeImage đã được giải quyết (resolve) hoặc bị từ chối (reject)
        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false)
            toast.error("Images not uploaded");
            return;
        });

        // Tạo fromData để lưu trữ lên firestore
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid
        };
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        const docRef = doc(db, "listings", params.listingId);
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing Edited");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    if (loading) {
        return <Spinner />;
    }

    return (
        <main className='max-w-xl px-2 mx-auto'>
            <h1 className='text-3xl text-center mt-6 font-bold'>Edit Listing</h1>
            <form onSubmit={onSubmit} className='bg-sky-100 p-8 mt-6'>
                {/* Sell Or Rent */}
                <p className='text-lg font-semibold'>Sell / Rent</p>
                <div className='flex'>
                    <button onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='type'
                        value="sale">
                        Sell
                    </button>
                    <button onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='type'
                        value="rent">
                        Rent
                    </button>
                </div>

                {/* Name */}
                <p className='text-lg mt-6 font-semibold'>Name</p>
                <input onChange={onChange}
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                    type='text'
                    id='name'
                    placeholder='Name'
                    maxLength="32"
                    minLength="10"
                    value={name}
                    required />

                {/* Beds And Bath */}
                <div className='flex space-x-6 mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Beds</p>
                        <input onChange={onChange}
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                            min="1"
                            max="100"
                            type='number'
                            id='bedrooms'
                            value={bedrooms}
                            required />
                    </div>
                    <div>
                        <p className='text-lg font-semibold'>Baths</p>
                        <input onChange={onChange}
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                            min="1"
                            max="100"
                            type='number'
                            id='bathrooms'
                            value={bathrooms}
                            required />
                    </div>
                </div>

                {/* Parking */}
                <p className='text-lg mt-6 font-semibold'>Parking spot</p>
                <div className='flex'>
                    <button onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='parking'
                        value={true}>
                        Yes
                    </button>
                    <button onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='parking'
                        value={false}>
                        No
                    </button>
                </div>

                {/* Furnished */}
                <p className='text-lg mt-6 font-semibold'>Furnished</p>
                <div className='flex'>
                    <button onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='furnished'
                        value={true}>
                        Yes
                    </button>
                    <button onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='furnished'
                        value={false}>
                        No
                    </button>
                </div>

                {/* Address */}
                <p className='text-lg mt-6 font-semibold'>Address</p>
                <textarea onChange={onChange}
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                    type='text'
                    id='address'
                    placeholder='Address'
                    value={address}
                    required />
                {!geolocationEnabled && (
                    <div className='flex space-x-6 justify-start mb-6'>
                        <div>
                            <p className='text-lg font-semibold'>Latitude</p>
                            <input
                                onChange={onChange}
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
                                type='number'
                                min="-90"
                                max="90"
                                id='latitude'
                                value={latitude}
                                required />
                        </div>
                        <div>
                            <p className='text-lg font-semibold'>Longitude</p>
                            <input
                                onChange={onChange}
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
                                type='number'
                                id='longitude'
                                min="-180"
                                max="180"
                                value={longitude}
                                required />
                        </div>
                    </div>
                )}

                {/* Description */}
                <p className='text-lg font-semibold'>Description</p>
                <textarea onChange={onChange}
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                    type='text'
                    id='description'
                    placeholder='Description'
                    value={description}
                    required />

                {/* Offer */}
                <p className='text-lg mt-6 font-semibold'>Offer</p>
                <div className='flex mb-6'>
                    <button onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='offer'
                        value={true}>
                        Yes
                    </button>
                    <button onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                        ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}
                        type='button'
                        id='offer'
                        value={false}>
                        No
                    </button>
                </div>

                {/* Price */}
                <div className='flex items-center mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className='flex w-full justify-center items-center space-x-6'>
                            <input onChange={onChange}
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                                min="50"
                                max="400000000"
                                type='number'
                                id='regularPrice'
                                value={regularPrice}
                                required />
                            {type === "rent" && (
                                <div className='text-md w-full whitespace-nowrap'>
                                    <p>$ / Month</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Discount Price */}
                {offer && (
                    <div className='flex items-center mb-6'>
                        <div>
                            <p className='text-lg font-semibold'>Discount Price</p>
                            <div className='flex w-full justify-center items-center space-x-6'>
                                <input onChange={onChange}
                                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                                    min="50"
                                    max="400000000"
                                    type='number'
                                    id='discountedPrice'
                                    value={discountedPrice}
                                    required={offer} />
                                {type === "rent" && (
                                    <div className='text-md w-full whitespace-nowrap'>
                                        <p>$ / Month</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Images */}
                <div className='mb-6'>
                    <p className='text-lg font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be the cover (max 6)</p>
                    <input onChange={onChange}
                        className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'
                        type='file'
                        id='images'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required />
                </div>

                {/* Button Submit */}
                <button className='mb-6 w-full px-7 py-3 bg-sky-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-sky-700 hover:shadow-lg
                    focus:bg-sky-700 focus:shadow-lg active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out'
                    type='submit'>
                    Edit Listing
                </button>
            </form>
        </main>
    )
}
