import jwtDecode from 'jwt-decode'
import axios from 'axios'
import dayjs from 'dayjs'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { backendUrl } from '../variables/backendUrl'
const baseURL = backendUrl

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)

  const axiosInstance =
    authTokens != null
      ? axios.create({
          baseURL,
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        })
      : axios.create({
          baseURL,
        })

  axiosInstance.interceptors.request.use(async (req) => {
    if (authTokens != null) {
      const user = jwtDecode(authTokens?.access)
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

      if (!isExpired) return req

      const response = await axios.post(`${baseURL}/api/auth/token/refresh/`, {
        refresh: authTokens?.refresh,
      })

      localStorage.setItem('authTokens', JSON.stringify(response.data))

      setAuthTokens(response.data)
      setUser(jwtDecode(response.data.access))

      req.headers.Authorization = `Bearer ${response.data.access}`
      return req
    } else return req
  })

  return axiosInstance
}

export default useAxios
