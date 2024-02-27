import { UserData } from '../handleInterfaces'

export function setUserToSessionStorage(user: UserData): void {
    const sanitizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        email_verified_at: user.email_verified_at
    };

    Object.entries(sanitizedUser).forEach(([key, value]) => {
        window.sessionStorage.setItem(`user_${key}`, JSON.stringify(value).replace(/^"|"$/g, ''));
    })
}