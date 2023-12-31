import { config } from "../shared";
import axios from "axios";

const authService = {
    register: (params, saveLogin) => {
        return new Promise((resolve, reject) => {
        if(/^\s*$/.test(params.name) || /^\s*$/.test(params.password)){
            reject(new Error("fields can't consist only from spaces"));
        }
        axios.post(`${config.backendUrl}/auth/register`, {
            name: params.name,
            email: params.email,
            password : params.password,
            birthdate: params.birthday
        }).then(res => {
            if(saveLogin){
                localStorage.setItem("reacttube-user", JSON.stringify(res.data.user._id))
                localStorage.setItem("reacttube-channel", JSON.stringify(res.data.channel._id))
            }
            sessionStorage.setItem("reacttube-user", JSON.stringify(res.data.user._id))
            sessionStorage.setItem("reacttube-channel", JSON.stringify(res.data.channel._id))
            resolve({
                user: res.data.user,
                channel: res.data.channel
            });
        })
        .catch(err => {
            reject(new Error(err.response.data.message));
        });
        })
    },
    login: (email, password, saveLogin) => {
        return new Promise((resolve, reject) => {
        if (/^\s*$/.test(email) || /^\s*$/.test(password)) {
            reject(new Error("Fields can't consist only of spaces"));
        }
        axios.post(`${config.backendUrl}/auth/login`, {
            email,
            password
        }).then(res => {
            if (saveLogin) {
                localStorage.setItem("reacttube-user", JSON.stringify(res.data.user._id));
                localStorage.setItem("reacttube-channel", JSON.stringify(res.data.channel._id));
            }
            sessionStorage.setItem("reacttube-user", JSON.stringify(res.data.user._id));
            sessionStorage.setItem("reacttube-channel", JSON.stringify(res.data.channel._id));

            resolve({
                user: res.data.user,
                channel: res.data.channel
            });
        })
        .catch(err => {
            reject(new Error(err.response.data.message));
        });
        });
    },
    loadStorageUser: (stored_user_id)=> {
        return new Promise((resolve,reject)=>{
            axios.get(`${config.backendUrl}/users/${stored_user_id}`)
            .then(res => { resolve({user: res.data}) })
            .catch(err => { resolve({user: null}) })
        })
    },
    loadStorageChannel: (stored_channel_id)=> {
        return new Promise((resolve,reject)=>{
            axios.get(`${config.backendUrl}/channels/${stored_channel_id}`)
            .then(res => { resolve({channel: res.data}) })
            .catch(err => { resolve({channel: null}) })
        })
    }
};

export default authService;