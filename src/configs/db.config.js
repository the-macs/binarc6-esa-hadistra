const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(result => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting' + err));
