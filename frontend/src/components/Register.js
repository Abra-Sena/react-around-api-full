import  React from 'react';
import { Link, useHistory } from 'react-router-dom';

function Register(props) {
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');

  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    props.handleRegister(email, password);
    if(localStorage.getItem('jwt')) {
      history.push('/');
    }
  }

  return (
    <div className="login">
      <form
        action="#"
        id="register"
        name="register"
        onSubmit={handleSubmit}
        className="login__form"
        noValidate
      >
        <h2 className="title">Sign up</h2>
        <fieldset className="form__field">
          <input id="email" type="email" name="email" className="login__input form__input_type_email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <span id="email-error" className="form__field form__field_error"></span>
          <input id="password" type="password" name="password" className="login__input form__input_type_password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <span id="password-error" className="form__field form__field_error"></span>
        </fieldset>
        <button type="submit" aria-label="user-login" className="button" onClick={props.toggleToolTip}>Sign up</button>
        <Link to='/signin' className="link">Already a member? Log in here!</Link>
      </form>
    </div>
  )
}

export default Register;
