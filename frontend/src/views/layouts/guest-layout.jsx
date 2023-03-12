import GuestHeader from "../includes/guest/header.jsx";
import Footer from "../includes/common/footer.jsx";

export default function GuestLayout({props, children}) {

    return <div
        className="h-screen w-screen overflow-x-hidden bg-gray-50 dark:bg-gray-800 dark:text-gray-50 flex flex-col relative">
        <GuestHeader/>
        <main className="container mx-auto mt-3 px-4 md:px-0 pb-10">
            {children}
        </main>
        <Footer/>
    </div>;
}