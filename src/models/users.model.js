const users = [
    {
        "id": "d00a6d15-2fbe-4e63-be50-59d2baf59d17",
        "name": "Esa Hadistra",
        "username": "esa.hadistra",
        "password": "$2b$10$T1Vu4PDU5oTZNwi1jAuFs.FPoX5UVHXHBO0iEoT3sJDKZpeFpHwCS"
    }
]

const { v4: uuidv4 } = require('uuid')

module.exports = {
    getUsers: () => {
        return users
    },
    storeUser: (name, username, password) => {
        users.push({
            id: uuidv4(),
            name,
            username,
            password
        })
    },
    deleteUser: (_id) => {
        userIndex = users.findIndex((user) => user.id == _id)

        users.splice(userIndex, 1);
    }
}