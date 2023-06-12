import React, { useState } from 'react'

export default function CreateListing() {

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
    });

    const { type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice } = formData;

    function onChange() {

    }

    return (
        <main className='max-w-xl px-2 mx-auto'>
            <h1 className='text-3xl text-center mt-6 font-bold'>Create A Listing</h1>
            <form className='bg-sky-100 p-8 mt-6'>
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
                        value="sale">
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
                    Create Listing
                </button>
            </form>
        </main>
    )
}
