

type UserType = {
    id: number,
    username: string,
    password: string,
    display_name: string,
    is_disabled: boolean,
}

type UserSessionType = {
    id: number,
    display_name: string, 
}

export {UserType, UserSessionType}