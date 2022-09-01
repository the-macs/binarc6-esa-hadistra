const pool = require('./../configs/db.config')

module.exports = {
    getHistory: async (id) => {

        try {
            const query = `
            SELECT
                a.user_choice,
                a.com_choice,
                a.result,
                a.playing_at,
                b.name
            FROM
                user_game_history a
            JOIN
                user_game_biodata b
            ON
                a.user_game_id = b.user_game_id
            WHERE
                a.user_game_id = $1`

            const rslt = await pool.query(query, [id])

            return rslt?.rows
        } catch (err) {
            throw new Error(err.message)

        }



    },
    storeHistory: async (insertObject) => {
        try {
            const { user_game_id, user_choice, com_choice, result, playing_at } = insertObject

            const query = `
            INSERT INTO
                user_game_history
            (
                user_game_id,
                user_choice,
                com_choice,
                result,
                playing_at
            ) 
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            RETURNING user_choice, com_choice, result, playing_at`
            const rslt = await pool.query(query, [user_game_id, user_choice, com_choice, result, playing_at])

            return rslt.rows[0]
        } catch (err) {
            throw new Error(err)
        }
    }
}