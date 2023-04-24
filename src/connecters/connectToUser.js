import { connect } from "../redux"

export const connectToUser = connect(
  (state) => ({ user: state.user }),
  (dispatch) => ({
    updateUser(data) {
      dispatch({ type: 'updateUser', payload: data })
    }
  })
)