export type currentUserType = {
    email?: string;
    password?: string;
    profilePicture?: string;
    name?: string
    _id?: string;
}

export type ErrorType = {
    message?: string;
    statusCode?: string;
    success?: string;
}