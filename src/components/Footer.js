/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { FaFacebook, FaGithub, FaInstagramSquare, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <div className="bg-gray-800 mt-6">
            <footer className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center md:items-start">
                        <img className="h-12 w-auto mb-4" src="https://dgs.net.vn/wp-content/uploads/2017/06/logo-nganh-bat-dong-san-401.jpg" alt="logo" />
                        <p className="text-sm text-gray-300">
                            Hoạt động trong lĩnh vực kinh doanh bất động sản, CES Realty Group đặt mục tiêu trở nên phát triển đến mọi người nhiều hơn nữa.
                        </p>
                    </div>
                    <div className="md:col-span-1 text-center">
                        <h2 className="text-lg font-bold text-white mb-4">Thông tin liên hệ</h2>
                        <p className="text-sm text-gray-300">
                            Địa chỉ: 123 Đường ABC, Thành phố XYZ<br />
                            Số điện thoại: 123-456-789<br />
                            Email: info@example.com
                        </p>
                    </div>
                    <div className="md:col-span-1 flex flex-col items-center md:items-end">
                        <h2 className="text-lg font-bold text-white mb-4">Follow us</h2>
                        <div className="flex justify-center md:justify-end space-x-4">
                            <a href="#" className="text-gray-300 hover:text-gray-400 transition duration-300">
                                <FaFacebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-gray-400 transition duration-300">
                                <FaGithub className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-gray-400 transition duration-300">
                                <FaInstagramSquare className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-gray-400 transition duration-300">
                                <FaYoutube className="h-6 w-6" />
                            </a>
                        </div>
                        <div className="text-gray-300 mt-2 text-sm">
                            &copy; {new Date().getFullYear()} CES Realty Group. All rights reserved.
                        </div>
                    </div>
                </div>
                <hr className="border-gray-700 my-8" />
                <div className="text-center text-sm text-gray-500">
                    <p>
                        Bản quyền thuộc về CES Realty Group. Được phát triển bởi <a className="text-gray-200 hover:text-gray-300" href="#">Your Company</a>.
                    </p>
                </div>
            </footer>
        </div>
    );
}
