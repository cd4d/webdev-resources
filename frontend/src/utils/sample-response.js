// Error 422 at registration, invalid entry

let err422 = {
  data: {
    errors: [
      {
        value: "v",
        msg: "Invalid value",
        param: "username",
        location: "body",
      },
    ],
  },
  status: 422,
  statusText: "Unprocessable Entity",
  headers: {
    "content-length": "85",
    "content-type": "application/json; charset=utf-8",
  },
  config: {
    url: "/api/users/register",
    method: "post",
    data:
      '{"username":"v","email":"b@b.bkk","password":"12345","confirmPassword":"12345"}',
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=utf-8",
    },
    baseURL: "http://localhost:3000",
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
  },
  request: {},
};

// Error 409, at registration, username/email already exists

let err409 = {
  data: {
    on: ["email"],
    message: 'Duplicate key error at: {"email":"b@b.bb"}',
    statusCode: 409,
    status: 409,
  },
  status: 409,
  statusText: "Conflict",
  headers: {
    "content-length": "105",
    "content-type": "application/json; charset=utf-8",
  },
  config: {
    url: "/api/users/register",
    method: "post",
    data:
      '{"username":"vb","email":"b@b.bb","password":"12345","confirmPassword":"12345"}',
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=utf-8",
    },
    baseURL: "http://localhost:3000",
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
  },
  request: {},
};
// error at login

let err401 = {
  data: "Unauthorized",
  status: 401,
  statusText: "Unauthorized",
  headers: {},
  config: {
    url: "/api/users/login",
    method: "post",
    data: '{"username":"f","password":"f"}',
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=utf-8",
    },
    baseURL: "http://localhost:3000",
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
  },
  request: {},
};

// successfullt registered

let successRegister = {
  data: "User successfully registered.",
  status: 200,
  statusText: "OK",
  headers: {
    "content-length": "29",
    "content-type": "text/html; charset=utf-8",
  },
  config: {
    url: "/api/users/register",
    method: "post",
    data:
      '{"username":"vb","email":"b@b.bbb","password":"12345","confirmPassword":"12345"}',
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=utf-8",
    },
    baseURL: "http://localhost:3000",
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
  },
  request: {},
};
