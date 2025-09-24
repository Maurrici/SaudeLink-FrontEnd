import axios from "axios";

const client = (() => {
        return axios.create({
                baseURL: `http://localhost:8000`,
                headers: {
                Accept: 'application/json, text/plain, */*',
                },
        })
})()

export default client;
      