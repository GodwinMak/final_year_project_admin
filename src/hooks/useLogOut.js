import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  // const { dispatch: dispatchWorkouts } = useAnimalContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    // dispatchWorkouts({ type: 'SET_WORKOUTS', payload: null })
    window.location = "/";

  }

  return { logout }
}