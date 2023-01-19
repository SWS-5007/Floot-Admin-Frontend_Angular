export default function passwordValidator(password: string): boolean {

  

  if (password.length < 6) {
    return false;
  }

  let containsUppercase = false;

  for (var i=0; i<password.length; i++){
    if (password.charAt(i) == password.charAt(i).toUpperCase() && password.charAt(i).match(/[a-z]/i)){
      containsUppercase = true;
    }
  }
  
  if (containsUppercase === false) {
    return false;
  }

  let containsLowercase = false;

  for (var i=0; i<password.length; i++){
    if (password.charAt(i) == password.charAt(i).toLowerCase() && password.charAt(i).match(/[a-z]/i)){
      containsLowercase = true;
    }
  }

  if (containsLowercase === false) {
    return false;
  }

  if (!(/[0-9]/.test(password))) {
    return false;
  }

  

  return true;

}