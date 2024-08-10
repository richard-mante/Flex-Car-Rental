// let dbURI = 'mongodb://localhost:27017/AbsoluteCampus';
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    // dbURI = 'mongodb://localhost:27017/AbsoluteCampus';
} else {
    console.log('Running in production mode');
    dbURI = 'mongodb+srv://richard:0249660998@flex.i2ax7.mongodb.net/Felx_Drive?retryWrites=true&w=majority&appName=flex'
}
module.exports = dbURI;
