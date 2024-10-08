export const generateQueryParams = (params) => {
  let queryParams = '';
  if (Array.isArray(params)) {
    params.map(param => {
      for (let key in param) {
        queryParams += `${key}=${param[key]}&`;
      }
    })
    queryParams = queryParams.slice(0, -1);
    return queryParams;
  }
  else {
    for (let param in params) {
      queryParams += `${param}=${params[param]}&`;
    }
    queryParams = queryParams.slice(0, -1);
    return queryParams;
  }

}