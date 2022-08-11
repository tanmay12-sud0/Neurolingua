
function addHomeworkModelFormat(req, userId) {
    return {
        userId: userId,
        title: req.body.title,        
        description: req.body.description,
        fileLink : req.body.fileLinks ? req.body.fileLinks : req && req.file && req.file.location
    };
}

module.exports = { addHomeworkModelFormat }