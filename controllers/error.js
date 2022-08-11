 module.export.handleErrors = (err) =>{
  console.log(err.message,err.code);
  let errors = { email : '' , password : ''};

       // incorrect email 
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if(err.code === 11000){
    errors.email = "This email is already registered";
    return errors;
  }

  if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
    
  }
  return errors;
}
