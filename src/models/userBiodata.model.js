const pool = require('./../configs/db.config')

module.exports = {
    // getUser: async (options = {}) => {
    //     try {
    //         const withTrashed = options.withTrashed ?? false
    //         const onlyTrashed = options.onlyTrashed ?? false
    //         const withPassword = options.withPassword ?? false

    //         let trashed = 'WHERE a.deleted_at IS NULL'
    //         if (onlyTrashed) trashed = 'WHERE a.deleted_at IS NOT NULL'
    //         if (withTrashed) trashed = ''

    //         let password = ''
    //         if (withPassword) password = ',a.password'

    //         const query = `
    //         SELECT
    //             a.id,
    //             a.username,
    //             b.name,
    //             a.role
    //             ${password}
    //         FROM 
    //             user_game a
    //         JOIN
    //             user_game_biodata b
    //         ON
    //             a.id = b.user_game_id
    //         ${trashed}`

    //         const rslt = await pool.query(query)

    //         return rslt.rows
    //     } catch (err) {
    //         throw new Error(err)
    //     }

    // },
    getUserBiodataById: async (id) => {
        try {
            const query = `
            SELECT
                b.user_game_id,
                a.username,
                b.name,
                a.role,
                b.email,
                b.birthplace,
                b.birthdate,
                b.address,
                b.gender,
                b.nationality,
                b.phone
            FROM 
                user_game a
            JOIN
                user_game_biodata b
            ON
                a.id = b.user_game_id
            WHERE
                a.id = $1`

            const rslt = await pool.query(query, [id])

            return rslt.rows[0]
        } catch (err) {
            throw new Error(err)
        }

    },
    updateUserBiodata: async (id, updateObject) => {
        try {
            const {
                email,
                birthplace,
                birthdate,
                address,
                gender,
                nationality,
                phone,
                user_game_id
            } = updateObject

            const query = `
            UPDATE
                user_game_biodata
            SET
                email = $1,
                birthplace = $2,
                birthdate = $3,
                address = $4,
                gender = $5,
                nationality = $6,
                phone = $7
            WHERE
                user_game_id = $8`

            const rslt = await pool.query(
                query,
                [
                    email,
                    birthplace,
                    birthdate,
                    address,
                    gender,
                    nationality,
                    phone,
                    user_game_id
                ])

            return rslt.rows[0]
        } catch (err) {
            throw new Error(err)
        }
    },
    deleteUser: async (id) => {
        try {
            const query = `
            UPDATE
                user_game
            SET
                deleted_at = NOW() 
            WHERE
                id = $1  
            RETURNING id`

            const rslt = await pool.query(query, [id])

            return rslt.rows[0]
        } catch (err) {
            return false
        }
    }
}