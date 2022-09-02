const UserBiodata = require('./../../models/userBiodata.model')
const { getUserVerified } = require('./../../utils/jtwToken.utils')
const { responseSuccess, responseError } = require('../../utils/responseFormatter.utils')

module.exports = {
    edit: async (req, res) => {
        const id = req.params.id

        try {
            const userBiodata = await UserBiodata.getUserBiodataById(id)
            res.render('dashboard/user/biodata', {
                layout: 'layouts/_dashboard-layout',
                user: req.user,
                userBiodata: userBiodata,
                message: {
                    msgType: req.flash('msgType'),
                    msg: req.flash('msg')
                },
            })
        } catch (err) {
            console.error(err);
            res.send(err)
        }
    },
    update: async (req, res) => {
        const { user_game_id, email, birthplace, birthdate, address, gender, nationality, phone } = req.body

        try {
            const update = {
                email,
                birthplace,
                birthdate,
                address,
                gender,
                nationality,
                phone
            }

            await UserBiodata.updateUserBiodata(user_game_id, update)

            req.flash('msgType', 'success')
            req.flash('msg', 'Biodata has been updated Successfully')
            res.redirect(`/dashboard/user-biodata/${user_game_id}`)
        } catch (err) {
            req.flash('msgType', 'danger')
            req.flash('msg', 'Error occured while updating biodata')
            console.log(err)
            res.redirect(`/dashboard/user-biodata/${user_game_id}`)
        }
    },
    getUserBiodata: async (req, res) => {
        const { id } = req.params

        const token = req.header.authorization
        const verify = getUserVerified(token)

        if (!verify) return res.status(401).json(responseError(401, 'User Unverified'))

        try {
            const userBiodata = await UserBiodata.getUserBiodataById(id)

            if (!userBiodata || userBiodata.length === 0) {
                return res.status(404).json(responseError(404, 'Data Not Found'))
            } else {
                res.status(200).json(responseSuccess(userBiodata))
            }
        } catch (err) {
            res.status(500).json(responseError(err))
        }
    }
}