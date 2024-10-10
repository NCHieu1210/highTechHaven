const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case 'LOADING':
      return action.status;
    default:
      return state
  }
}
export default loadingReducer;