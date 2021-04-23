import React from 'react';
import firebase from '../../firebase';
import md5 from 'md5';
import { Form, Input, Button, Card, Row, Col, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Register.css';

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Password is invalid' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    };

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('user saved');
                        })
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({ errors: this.state.errors.concat(err), loading: false });
                    })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                });
        }
    };

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    };

    handleInputError = (errors, inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName)
        )
            ? "error"
            : ""
    };

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        return (
            <div className="site-card-wrapper">
                <Row>
                    <Col offset={7}>
                        <Card 
                            title="Register for Quiz" 
                            bordered={false} 
                            style={{ width: 600, textAlign: "center" }}
                            cover={<img className="register" alt="register" src="https://www.lifesavvy.com/thumbcache/0/0/05993f497e16d78a50ee771b116f62dc/p/uploads/2020/10/269d4e5a.jpg" />}
                        >
                            <Form
                                name="basic"
                                initialValues={{
                                    remember: true,
                                }}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                    ]}
                                >
                                    <Input 
                                        name="username" 
                                        onChange={this.handleChange} 
                                        value={username} 
                                        placeholder="Username" 
                                        prefix={<UserOutlined />} 
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email adress!',
                                    },
                                    ]}
                                    validateStatus={this.handleInputError(errors, 'email')} 
                                >
                                    <Input 
                                        name="email" 
                                        placeholder="Email Adress" 
                                        onChange={this.handleChange} 
                                        value={email}
                                        type="email" 
                                        prefix={<MailOutlined />} 
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    ]}
                                    validateStatus={this.handleInputError(errors, 'password')} 
                                >
                                    <Input.Password 
                                        name="password" 
                                        onChange={this.handleChange} 
                                        value={password} 
                                        placeholder="Password" 
                                        prefix={<LockOutlined />} 
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="passwordConfirmation"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ]}
                                    validateStatus={this.handleInputError(errors, 'password')} 
                                >
                                    <Input.Password 
                                        name="passwordConfirmation" 
                                        onChange={this.handleChange} 
                                        value={passwordConfirmation} 
                                        placeholder="Password Confirmation" 
                                        prefix={<ReloadOutlined />} 
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" onClick={this.handleSubmit} loading={loading ? true : false} block>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                            
                        </Card>
                        {errors.length > 0 && (
                            <Alert message="Error" description={this.displayErrors(errors)} type="error" style={{ marginTop: 16 }} showIcon />
                        )}
                        <Card style={{ width: 600, marginTop: 16, textAlign: "center" }}>
                            Already a user? <Link to="/login">Login</Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Register;