/*
    This interface is to mimic the User dataset
*/

interface UserInterface{
    userId ?: number,
    username ?: string,
    password ?: string,
    first_name ?: string,
    last_name ?: string,
    email ?: string,
    address ?: string,
    birthday ?: Date,
}

export default UserInterface