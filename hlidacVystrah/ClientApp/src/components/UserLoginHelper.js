import axios from "axios";

class UserLoginHelper {

    constructor() {

    }

    TokenLogin = async () => {
        let defaultLoginResponse = { loggedIn: false, userEmail: null };
        let token = localStorage.getItem("loginToken");
        if (!token)
            return defaultLoginResponse;

        try {
            const response = await axios.post("/api/user/tokenlogin", {
                LoginToken: token
            });

            return { loggedIn: response.data.responseCode === 200, userEmail: response.data.email };
        } catch (error) {
            return defaultLoginResponse;
        }
    };
}

export default UserLoginHelper;