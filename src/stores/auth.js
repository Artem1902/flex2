import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {useGeneralStore} from './general'
import {useUsersStore} from './users'
import authOperations
    from './helpers/GoogleAuthOperations.js'

export const useAuthStore = defineStore('auth', () => {
    const generalStore = useGeneralStore()
    const usersStore = useUsersStore()
    const {generalApiOperation} = generalStore

    const user = ref(null)
    restoreUserFromLocalStorage()

    const getUser = computed(() => user.value)

    async function signUpWithEmailAndPassword(email, password) {
        try {
            const res = await generalApiOperation({
                operation: () => authOperations.signUpWithWithEmailAndPassword({
                    email,
                    password
                })
            })
            user.value = res
            localStorage.setItem('authUser', JSON.stringify(user.value))

            await usersStore.addUserWithCustomId({
                id: user.value?.uid,
                data: {
                    email,
                    role: null
                }
            })

            await usersStore.loadUserById(user.value.uid)
        } catch (error) {
            console.error("Error during registration:", error)
        }
    }

    async function signInWithEmailAndPassword(email, password) {
        try {
            const res = await generalApiOperation({
                operation: () => authOperations.signInWithWithEmailAndPassword({
                    email,
                    password
                })
            })
            user.value = res
            localStorage.setItem('authUser', JSON.stringify(user.value))

            await usersStore.loadUserById(user.value.uid)
            return res
        } catch (error) {
            console.error("Error logging in:", error)
            throw error
        }
    }

    async function loginWithGoogleAccount() {
        try {
            const res = await generalApiOperation({
                operation: () => authOperations.loginWithGoogleAccountPopup()
            })
            user.value = res
            localStorage.setItem('authUser', JSON.stringify(user.value))

            await usersStore.addUserWithCustomId({
                id: user.value?.uid,
                data: {
                    email: user.value?.email,
                    role: null
                }
            })

            await usersStore.loadUserById(user.value.uid)
            return res
        } catch (error) {
            console.error("Error signing in with Google:", error)
            throw error
        }
    }

    function logOut() {
        generalApiOperation({
            operation: () => authOperations.logout()
        })
        user.value = null
        localStorage.removeItem('authUser')
        usersStore.clearCurrentUserUser()
    }

    async function getAuthData() {
        return user.value
    }

    function restoreUserFromLocalStorage() {
        const storedUser = localStorage.getItem('authUser')
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser)
            } catch (e) {
                console.error("User recovery error:", e)
            }
        }
    }


    return {
        signUpWithEmailAndPassword,
        signInWithEmailAndPassword,
        loginWithGoogleAccount,
        logOut,
        getUser,
        getAuthData
    }
})
