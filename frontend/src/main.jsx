import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./views/pages/error.jsx";
import {commonPages, userPages} from "./core/pages.js";
import {Flowbite} from "flowbite-react";
import {Provider} from "react-redux";
import store from "./core/state/store.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>
    },
    ...userPages,
    ...commonPages

]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
                    <Flowbite>
            <RouterProvider router={router}/>
        </Flowbite>
        </Provider>
    </React.StrictMode>
)
