import React, {Component} from 'react';
import * as firebase from 'firebase'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import Card from '../../hoc/Card/Card';
import Spinner from '../../components/Spinner/Spinner';
import './Auth.css';

// Material UI Imports start
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
// Material UI Imports end

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "20px",
            width : "95%"
        },
        button: {
            margin: theme.spacing.unit,
            marginBottom : "15px"
        },
        authMessage :{ 
            textDecoration : 'underline', 
            cursor : 'pointer'
        }
    }
}

class Auth extends Component{
    state = {
        email: '',
        pass : '',
        error : '',
        loading : false,
        isSignUp : true
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isLongEnough', (value) => {
            if (value.trim().length < 6) {
                return false;
            }
            return true;
        });
    }
 
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }
 
    handleSubmit = () => {
        this.setState({loading : true});
        if(this.state.isSignUp){
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass)
            .then(res => {
                const uid = res.user.uid;
                this.setState({loading : false});
                this.props.onLogin(uid);
                this.props.history.replace("/todos");
            })
            .catch(error => {
                this.setState({loading : false});
                let errorMessage = '';
                if(error.code === 'auth/email-already-in-use')
                    errorMessage = "Account For This Email is Already Registered"
                else if(error.code === 'auth/invalid-email')
                    errorMessage = "Invalid Email"
                else     
                    errorMessage = error.message;
                this.setState({error : errorMessage})
            });
        }
        else{
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
            .then(res =>{
                const uid = res.user.uid;
                this.props.onLogin(uid);
                this.props.history.replace("/todos");
            })    
            .catch(error =>{
                this.setState({loading : false});
                let errorMessage = ''
                if(error.code === 'auth/wrong-password')
                    errorMessage = "Wrong Password";
                else if(error.code === 'auth/user-not-found')  
                    errorMessage = "User Doesn't Exist";  
                else     
                    errorMessage = error.message;                    
                this.setState({error : errorMessage})
            });
        }
    }

    switchAuthState = () => {
        this.setState({isSignUp : !this.state.isSignUp})
    }

    render(){
        let authMessage = "Already Have an Account? ";
        let authLink = "Sign in";
        if(!this.state.isSignUp){
            authMessage = "Dont Have an Account? ";
            authLink = "Sign up";
        }
        return(
            <div  className = "Main">
                <h1 className="display-4">Todo App</h1>
                <h5 className = "heading">With Firebase's Real Time DB</h5>
            {!this.state.loading ?
                <Card>
                    <p className = "Error">{this.state.error ? this.state.error  : null}</p>
                    <ValidatorForm
                        ref="form"
                        onSubmit={this.handleSubmit}
                        onError={errors => console.log(errors)}>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Email"
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'Invalid Email']}
                        /><br/>
                        <TextValidator
                            className = {this.props.classes.TextFields}
                            label="Password"
                            type="password"
                            onChange={this.handleChange}
                            name="pass"
                            value={this.state.pass}
                            validators={['required', 'isLongEnough']}
                            errorMessages={['This field is required', 'Password must be longer than 6 characters']}
                        /><br/>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="secondary" 
                            className={this.props.classes.button}>{this.state.isSignUp ? "Sign Up" : "Sign In"}</Button>
                    </ValidatorForm>
                    <p>{authMessage}<strong className = {this.props.classes.authMessage} onClick = {this.switchAuthState}>{authLink}</strong></p>
                </Card> : <div  className = "auth-spinner"><Spinner/></div>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuth : state.auth.isAuth
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onLogin : (uid) => dispatch(actions.setLogin(uid)),
        onLogout : () => dispatch(actions.setLogout()),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Auth));