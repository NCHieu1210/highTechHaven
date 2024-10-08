const reRenderReducer = (state = false, action) => {
  switch (action.type) {
    case 'RE_RENDER':
      return action.status;
    default:
      return state
  }
}
export default reRenderReducer;