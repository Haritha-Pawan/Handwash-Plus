import bcrypt from 'bcryptjs';


export const hashpassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salt);
};



export const comparePassword = async(password,hashedPassword)=>{

    return bcrypt.compare(password,hashedPassword);

}