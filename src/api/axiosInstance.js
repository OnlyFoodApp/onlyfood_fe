import axios from "axios";
import jwtDecode from "jwt-decode";

// const BASE_URL = "https://localhost:7173";

const BASE_URL = "https://pillsy.azurewebsites.net";

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

let token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axiosPrivate.interceptors.request.use(async (req) => {
  if (!token) {
    // eslint-disable-next-line no-const-assign
    token = localStorage.getItem("token")
      // ? JSON.parse(localStorage.getItem("token"))
      // : null;
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    req.headers.Authorization = `Bearer ${token}`;
  }

  const user = jwtDecode(token);
  let date = new Date();

  // Check if the token is expired
  const isExpired = user.exp < date.getTime() / 1000;
  // const params = {
  //   accessToken: token.accessToken,
  //   refreshToken: token.refreshToken,
  //   expires: token.expires,
  // };

  if (!isExpired) {
    return req;
  }
//  else {
//     console.log(req);

//     const response = await axios.post(
//       `${BASE_URL}/api/v1/auths/refresh`,
//       params
//     );

//     localStorage.setItem("loginInfo", JSON.stringify(response.data));

//     req.headers.Authorization = `Bearer ${response.data.accessToken}`;

//     // Return the updated request
//     return req;
//   }
});

export { axiosPrivate, axiosPublic };