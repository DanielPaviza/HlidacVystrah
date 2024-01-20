import axios from "axios";

class UserLoginHelper {

    TokenLogin = async () => {
        let defaultLoginResponse = { loggedIn: false, userEmail: null, loginToken: "", isActive: false };
        let token = localStorage.getItem("loginToken");
        if (!token)
            return defaultLoginResponse;

        try {
            const response = await axios.post("/api/user/tokenlogin", {
                LoginToken: token
            });

            let data = response.data;

            if (data.responseCode === 200)
                return { loggedIn: true, userEmail: data.email, loginToken: token, isActive: data.isActive }

            return defaultLoginResponse;

        } catch (error) {
            return defaultLoginResponse;
        }
    };
}

export default UserLoginHelper;