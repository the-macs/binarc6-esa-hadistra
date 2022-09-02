const UserHistory = require('./../../models/userHistory.model')

module.exports = {
    index: async (req, res) => {
        const id = req.params.id

        try {
            const userHistory = await UserHistory.getHistory(id)

            res.render('dashboard/user/history', {
                layout: 'layouts/_dashboard-layout',
                user: req.user,
                userHistory: userHistory
            })
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }
}