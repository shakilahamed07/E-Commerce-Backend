import  bcrypt  from 'bcrypt';

const isPasswordValid = (password: string, hashedPassword: string): boolean => {

 return bcrypt.compareSync(password, hashedPassword);

}

export default isPasswordValid;