const pool = require('./../configs/db.config')

class UserBiodata {
    async getUserBiodataById(id) {
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

    }

    async updateUserBiodata(id, updateObject) {
        try {
            const {
                email,
                birthplace,
                birthdate,
                address,
                gender,
                nationality,
                phone
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
                    id
                ])

            return rslt.rows[0]
        } catch (err) {
            throw new Error(err)
        }
    }

    async deleteUser(id) {
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

module.exports = new UserBiodata()