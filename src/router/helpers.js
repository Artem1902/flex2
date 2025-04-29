import {useAuthStore} from "../stores/auth.js";
import {useUsersStore} from "../stores/users.js";

export function isAuthenticated() {
    return useAuthStore().getUser
}

export async function isRouteAvailable(routeItem) {
    const required = routeItem.meta?.requireAuth;
    const allowedRoles = routeItem.meta?.allowedRoles;
    const usersStore = useUsersStore()
    const authStore = useAuthStore()

    if (required) {
        if (!usersStore.getCurrentUser) {
            await usersStore.loadUserById(authStore.getUser?.uid)
        }

        const userRole = usersStore.getCurrentUserRole

        return allowedRoles?.includes(userRole)
    }
    return true
}





