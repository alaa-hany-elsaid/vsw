import {useSelector} from "react-redux";
import UserLayout from "./views/layouts/user-layout";
import GuestLayout from "./views/layouts/guest-layout";
import  GuestIndex from './views/includes/guest/index';
import UserIndex from "./views/includes/user/index.jsx";

// App component is responsible for render the index component for user if authenticated or guest if not
function App() {
    const is_auth = useSelector((state) => state.auth.is_authenticated);
    return (is_auth ? <UserLayout>
            <UserIndex></UserIndex>
        </UserLayout> : <GuestLayout>
            <GuestIndex>
            </GuestIndex>
        </GuestLayout>
    )
}

export default App
