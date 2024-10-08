import { getCookie } from "../helpers/cookies";
const API_Domain = "https://hthecomapiserver.azurewebsites.net/api";
const getToken = () => {
  return getCookie("hthToken");
};


//Login async
export const login = async (path, username, password) => {
  const response = await fetch(API_Domain + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      UserName: username,
      Password: password
    })
  });
  const result = await response.json();
  return result;
}
//END Login async


//Get a user by token async
export const getUserByTokenAsync = async (path) => {
  const response = await fetch(API_Domain + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    }
  })
  const result = await response.json();
  return result;
}
//END Get a user by token async

//Get all async
export const getAllAsync = async (path) => {
  const response = await fetch(API_Domain + path);
  const result = await response.json();
  return result;
}
//END Get all async

//Get all async
export const getAllByTokenAsync = async (path) => {
  const response = await fetch(API_Domain + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    }
  }
  );
  const result = await response.json();
  return result;
}
//END Get all async

//Get all async
export const getBySlugAsync = async (path) => {
  const response = await fetch(API_Domain + path);
  const result = await response.json();
  return result;
}
//END Get all async

//Get all by token async
export const getAllByTokeAsync = async (path) => {
  const response = await fetch(API_Domain + path, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    }
  });
  const result = await response.json();
  return result;
}
//END Get all async

//POST a data async
export const postAsync = async (path, data) => {
  const response = await fetch(API_Domain + path, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
    body: data,
  });
  if (response.status >= 200 && response.status < 300) {
    const result = await response.json();
    return result;
  }
  console.log("ERROR", response);
  return response.status;
}
//END POST range data async

//POST a data wtith json async
export const postWithJsonAsync = async (path, data) => {
  const response = await fetch(API_Domain + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (response.status >= 200 && response.status < 300) {
    const result = await response.json();
    return result;
  }
  // console.log("ERROR", response.statusText);
  return response.status;
}
//END POST data wtith json async

//POST range data async
export const postRangeAsync = async (path, data) => {
  const response = await fetch(API_Domain + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
//END POST range data async

//POST a data async
export const putAsync = async (path, data) => {
  const response = await fetch(API_Domain + path, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
    body: data,
  });
  const result = await response.json();
  return result;
}
//END POST a data async

//POST a data by JSON async
export const putByJsonAsync = async (path, data) => {
  const response = await fetch(API_Domain + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
//END POST a data by JSON async


export const putWithQueryAsync = async (path) => {
  const response = await fetch(API_Domain + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const result = await response.json();
  return result;
}


//DELETE a data async
export const deleteAsync = async (path) => {
  const response = await fetch(API_Domain + path, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    }
  });
  const result = await response.json();
  return result;
}
//END DELETE a data async

//DELETE a data with query async
// export const deleteWithQueryAsync = async (path) => {
//   const response = await fetch(API_Domain + path, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${getToken()}`,
//     }
//   });
//   const result = await response.json();
//   return result;
// }
//END DELETE a data with query async


//DELETE a data async
export const deleteRangeAsync = async (path, data) => {
  const response = await fetch(API_Domain + path, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
//Post a data async

