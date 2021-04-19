import  React from 'react';
import { Link, useHistory} from 'react-router-dom'

function Login(props) {
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');

  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    // console.log("username: " + email, "password: " + password);
    props.handleLogin(email, password);
    if(localStorage.getItem('jwt')) {
      history.push('/');
    }
  }


  return (
    <div className="login">
      <form
        action="#"
        id="login"
        name="login"
        onSubmit={handleSubmit}
        className="login__form"
      >
        <h2 className="title">Log in</h2>
        <fieldset className="form__field">
          <input id="email" type="email" name="email" className="login__input form__input_type_email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <span id="email-error" className="form__field form__field_error"></span>
          <input id="password" type="password" name="password" className="login__input form__input_type_password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <span id="password-error" className="form__field form__field_error"></span>
        </fieldset>

        <button type="submit" aria-label="user-login" className="button" >Log in</button>
        <Link to='/signup' className="link">Not a member yet? Sign up here!</Link>
      </form>
    </div>
  )
}

export default Login;
