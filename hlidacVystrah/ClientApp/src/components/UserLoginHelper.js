import axios from "axios";

class UserLoginHelper {

    constructor() {

    }

    TokenLogin = async () => {
        let defaultLoginResponse = { loggedIn: false, userEmail: null, loginToken: "" };
        let token = localStorage.getItem("loginToken");
        if (!token)
            return defaultLoginResponse;

        try {
            const response = await axios.post("/api/user/tokenlogin", {
                LoginToken: token
            });

            let data = response.data;

            if (data.responseCode === 200)
                return { loggedIn: true, userEmail: data.email, loginToken: token }

            return defaultLoginResponse;

        } catch (error) {
            return defaultLoginResponse;
        }
    };
}

export default UserLoginHelper;