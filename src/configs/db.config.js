const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://binarc6:GpCC6BfhtkVceKCh@cluster0.4smhuyc.mongodb.net/games?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(result => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting' + err));
