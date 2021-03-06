import React, {Component} from 'react';
import FacebookLogin from "react-facebook-login";
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import  *  as utils from './utils'


class Login extends Component {

    constructor(props) {
        super(props);
        this.callbackHandler = this.callbackHandler.bind(this);

        Notification.requestPermission().then(function(result) {
            document.cookie =`notification_perm=${result}`
        });

    }
    render() {
        return (
            <FacebookLogin
                appId={process.env.CLIENT_ID}
                autoLoad={true}
                fields="name,email,picture"
                onClick={() => {this.props.history.push("/home");
                window.location.reload()}}
                callback={this.callbackHandler}
            />
        );
    }

    callbackHandler(fbResponse) {

        axios.get("/api/oauth/facebook/token?access_token=" + fbResponse.accessToken)
            .then(res => {
                console.log('init set token');
                document.cookie=`access_token=${res.data.token}`;
                document.cookie=`refresh_token=${res.data.refreshToken}`;
                Login.setAxios();

            })

    }




    static setAxios(cookieName = "access_token") {
        if (document.cookie.indexOf("access_token") !== -1) {
            axios.defaults.headers.common['Authorization'] = "bearer "
                + utils.getCookie(cookieName);
        }

    }
}

export default withRouter(Login);