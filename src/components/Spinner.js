import React from 'react';
import { PacmanLoader } from 'react-spinners';


export default function Spinner() {
    return (
        <div className='bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50'>
            <div>
                <PacmanLoader color='#36d7b7' loading={true} size={50} className='h-24' />
            </div>
        </div>
    )
}
