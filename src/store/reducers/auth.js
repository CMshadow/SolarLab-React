const initialStat = {
  token: null,
  userID: '0000-0000-0000-0000',
  error: null,
  loading: false
};
//
// const authStart = (state, action) => {
//   return updateObject(state, {error: null, loading: true});
// };
//
// const authSuccess = (state, action) => {
//   return updateObject(state, {
//     token: action.idToken,
//     userId: action.userId,
//     error: null,
//     loading: false} );
// };
//
// const authFail = (state, action) => {
//   return updateObject(state, {
//     error: action.error,
//     loading: false} );
// };
//
// const authLogout = (state, action) => {
//   return updateObject(state, {token: null, userId: null});
// };

const reducer = (state=initialStat, action) => {
  switch (action.type) {
    // case actionTypes.AUTH_START:
    //   return state;
    //
    // case actionTypes.AUTH_SUCCESS:
    //   return state;
    //
    // case actionTypes.AUTH_FAIL:
    //   return state;
    //
    // case actionTypes.AUTH_LOGOUT:
    //   return state;

    default:
      return state;
  }
};

export default reducer;
