import {useSelector} from "react-redux";
import GuestLayout from "./guest-layout.jsx";
import UserLayout from "./user-layout";

export default function LayoutResolver({props, children}) {
    const is_auth = useSelector((state) => state.auth.is_authenticated)
    return is_auth ? <UserLayout>
        {children}
    </UserLayout> : <GuestLayout>
        {children}
    </GuestLayout>;
}