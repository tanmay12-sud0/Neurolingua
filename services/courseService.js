
function addCourseModelFormat(req, userId) {
    
    // const languageObj = req.body.language ? JSON.parse(req.body.language) : [];
    
    return {
        userId: userId,
        title: { data: req.body.title },
        language: { data: req.body.language },
        // languageId: languageObj.id,
        course: { data: req.body.course },
        program: { data: req.body.program },
        price: { data: req.body.price },
        price1: { data: req.body.price1 },
        price2: { data: req.body.price2 },
        description: { data: req.body.description },
        courseImage: { data: req && req.file && req.file.location }
    };
}

function updateCourseModelFormat(req){
    let body = JSON.parse(req.body);
    console.log(body);
    return body;
}


module.exports = { addCourseModelFormat, updateCourseModelFormat }