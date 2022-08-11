const jwt = require('jsonwebtoken');
const secureData = require('./secureData')
    
    exports.generateToken = async(obj, exp) => {
        // console.log(obj)
        const access_token = jwt.sign(obj, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: exp});
        const token_gen = secureData.encrypt(access_token)
        // console.log(token_gen)
        return token_gen;
    };

    exports.createToken = async function (data) {
        const objs = {
            name: data.fullName,
            email: data.email,
            id: data._id,
            role: data.role,
            verified: data.isVerified,
            onType:data.onType
        }
        const exp = '120000d'
        const access = await module.exports.generateToken(objs, exp)
        // console.log(access)
        return { access }
    }