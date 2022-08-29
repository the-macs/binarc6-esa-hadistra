const responseDefaults = () => {
    const response = {
        'meta': {
            'code': 200,
            'status': 'success',
            'message': null,
        },
        'data': null,
    }

    return response
}

module.exports = {
    responseSuccess: (data = null, message = null) => {
        const response = responseDefaults()

        response.meta.message = message
        response.data = data

        return response
    },
    responseError: (code = 404, message = null, data = null) => {
        const response = responseDefaults()

        response.meta.status = 'error'
        response.meta.message = message
        response.meta.code = code
        response.data = data

        return response
    }
}