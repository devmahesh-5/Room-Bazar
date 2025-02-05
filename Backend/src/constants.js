import crypto from "crypto";

export const DB_NAME="Room-Bazar";

export const options ={
    httpOnly: true,
    secure : true
}//this ensures that cookie is not modifiable from frontend

export const generateSignature = (dataToSign) => {
    const signature = crypto.createHmac('sha512', process.env.ESEWA_SECRET_KEY).update(dataToSign)
        .digest('base64');
    return signature;
};
