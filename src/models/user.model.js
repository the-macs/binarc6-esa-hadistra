const pool = require('./../configs/db.config')

module.exports = {
    getUser: async (options = {}) => {
        try {
            const withTrashed = options.withTrashed ?? false
            const onlyTrashed = options.onlyTrashed ?? false
            const withPassword = options.withPassword ?? false

            let trashed = 'WHERE a.deleted_at IS NULL'
            if (onlyTrashed) trashed = 'WHERE a.deleted_at IS NOT NULL'
            if (withTrashed) trashed = ''

            let password = ''
            if (withPassword) password = ',a.password'

            const query = `
            SELECT
                a.id,
                a.username,
                b.name,
                a.role
                ${password}
            FROM 
                user_game a
            LEFT JOIN
                user_game_biodata b
            ON
                a.id = b.user_game_id
            ${trashed}`

            const rslt = await pool.query(query)

            return rslt.rows
        } catch (err) {
            throw new Error(err)
        }

    },
    getUserById: async (id, options = {}) => {
        try {
            const withPassword = options.withPassword ?? false

            let password = ''
            if (withPassword) password = ',a.password'

            const query = `
            SELECT
                a.id,
                a.username,
                b.name,
                a.role
                ${password}
            FROM 
                user_game a
            LEFT JOIN
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
    getUserByUsername: async (username, options = {}) => {
        try {
            const withPassword = options.withPassword ?? false

            let password = ''
            if (withPassword) password = ',a.password'

            const query = `
            SELECT
                a.id,
                a.username,
                b.name,
                a.role,
                CASE
                    WHEN a.deleted_at IS NULL THEN 1
                    ELSE 0
                END AS is_active
                ${password}
            FROM 
                user_game a
            LEFT JOIN
                user_game_biodata b
            ON
                a.id = b.user_game_id
            WHERE
                a.username = $1`

            const rslt = await pool.query(query, [username])

            return rslt.rows[0]
        } catch (err) {
            throw new Error(err)
        }

    },
    storeUser: async (insertObject) => {
        const client = await pool.connect()

        try {
            const { name, username, role, password } = insertObject

            await client.query('BEGIN')

            // Insert Game
            const query = `INSERT INTO user_game (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role`
            const rslt = await client.query(query, [username, password, role])

            // Insert User Game Biodata
            const query2 = `INSERT INTO user_game_biodata (user_game_id, name) VALUES ($1, $2) RETURNING name`
            const rslt2 = await client.query(query2, [rslt.rows[0].id, name])

            // Merging Games for Return
            const rslt3 = { ...rslt.rows[0], ...rslt2.rows[0] }

            // Commit Transaction
            await client.query('COMMIT')

            return rslt3
        } catch (err) {
            // Rollback Transaction
            await client.query('ROLLBACK')

            throw new Error(err)
        }
    },
    updateUser: async (id, updateObject) => {
        const client = await pool.connect()

        try {
            const { name, role, password } = updateObject

            // Start a transaction
            await client.query('BEGIN')

            // Update User Game
            const query = `
            UPDATE
                user_game
            SET
                password = $1,
                role = $2
            WHERE
                id = $3    
            RETURNING id, username, role`
            const rslt = await client.query(query, [password, role, id])

            // Update User Game Biodata
            const query2 = `
            UPDATE
                user_game_biodata
            SET
                name = $1
            WHERE
                user_game_id = $2
            RETURNING name`
            const rslt2 = await client.query(query2, [name, id])

            // Merging Games for Return
            const rslt3 = { ...rslt.rows[0], ...rslt2.rows[0] }

            // Commit Transaction
            await client.query('COMMIT')

            return rslt3
        } catch (err) {
            // Rollback Transaction
            await client.query('ROLLBACK')

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

            const query2 = `
            UPDATE
                user_game_biodata
            SET
                deleted_at = NOW() 
            WHERE
                user_game_id = $1  
            RETURNING id`

            await pool.query(query2, [id])

            return rslt.rows[0]
        } catch (err) {
            return false
        }
    }
}