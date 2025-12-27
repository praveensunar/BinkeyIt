const generatedOtp = ()=>{
    return Math.floor(Math.random() * 900000) + 100000   // it gives otp btw 100000 -999999
}
export default generatedOtp