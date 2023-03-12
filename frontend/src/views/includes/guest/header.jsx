import React, {useEffect, useState} from 'react';
import Logo from '../../../assets/logo.png';
import {tools} from "../../../core/pages.jsx";
import {Link} from "react-router-dom";
import 'flowbite/dist/flowbite'
import {initDropdowns , initCollapses} from "flowbite";
export default function GuestHeader() {


    useEffect(()=> {
        initDropdowns();
        initCollapses();
    } , [])


    return (<nav className="bg-white border-gray-200 px-4 md:px-4 py-2.5 md:py-6 dark:bg-gray-900 w-screen">
        <div className="container mx-auto">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
                <a href="/" className="flex items-center">
                    <img src={Logo} className="h-6 mr-3 sm:h-9" alt="Flowbite Logo"/>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VSW</span>
                </a>
                <div className="flex items-center md:order-2">
                    <button
                        className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 mr-1 md:mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Login
                    </button>

                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 mr-1 md:mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sign
                        up
                    </button>


                    <button data-collapse-toggle="mega-menu" type="button"
                            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="mega-menu" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                  clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <div id="mega-menu"
                     className="items-center justify-between hidden w-full text-sm md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
                        <li>
                            <Link to='/'
                               className="block py-2 pl-3 pr-4 text-blue-600 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                               aria-current="page">Home</Link>
                        </li>
                        <li>
                            <button id="mega-menu-dropdown-button" data-dropdown-toggle="mega-menu-dropdown"
                                    className="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-700 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">
                                Tools <svg aria-hidden="true" className="w-5 h-5 ml-1 md:w-4 md:h-4" fill="currentColor"
                                           viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"></path>
                            </svg>
                            </button>
                            <div id="mega-menu-dropdown"
                                 className="absolute z-10  hidden w-full text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700  dark:bg-gray-700">
                                <div className="p-4  text-gray-900  dark:text-white">
                                    <ul className="flex flex-row flex-wrap justify-evenly"
                                        aria-labelledby="mega-menu-dropdown-button">

                                        {
                                            tools.map((tool, key) => {
                                                return (<li key={key} className="ml-1">
                                                    <Link to={tool.path}
                                                       className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
                                                        {tool.title}
                                                    </Link>
                                                </li>)
                                            })
                                        }

                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">Team</a>
                        </li>
                        <li>
                            <a href="#"
                               className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700">About
                                us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>);
}

