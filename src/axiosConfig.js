import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
})

async function refreshAccessToken() {
    try {
        const response = await axios.post(
            '/auth/refresh',
            {},
            {
                baseURL: 'http://localhost:8080/api',
                withCredentials: true,
            }
        )

        const newAccessToken = response.data.accessToken
        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken)

            api.defaults.headers.common['Authorization'] = 'Bearer ${newAccessToken}'
        }

        return newAccessToken
    } catch (error) {
        console.error('Error refreshing token:', error)
        throw error
    }
}

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const newAccessToken = await refreshAccessToken()

                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = 'Bearer ${newAccessToken}'
                }

                return api(originalRequest)
            } catch (refreshError) {
                console.error('Error refreshing or retrying request:', refreshError)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
