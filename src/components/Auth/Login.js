import React from 'react';
import firebase from '../../firebase';
import { Form, Input, Button, Card, Row, Col, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Login.css';

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                });
        }
    };

    isFormValid = ({ email, password }) => email && password;

    handleInputError = (errors, inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName)
        )
            ? "error"
            : ""
    };

    render() {
        const { email, password, errors, loading } = this.state;

        return (
            <div className="site-card-wrapper1">
                <Row>
                    <Col offset={7}>
                        <Card 
                            title="Login to Quiz" 
                            bordered={false} 
                            style={{ width: 600, textAlign: "center" }}
                            cover={<img className="login" alt="login" src="https://is4-ssl.mzstatic.com/image/thumb/Purple30/v4/a4/37/5f/a4375f87-9bbd-27c2-3d12-97e8c7a822e3/source/512x512bb.jpg" />}
                        >
                            <Form
                                name="basic"
                                initialValues={{
                                    remember: true,
                                }}
                            >

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
                            Don't have an account? <Link to="/register">Register</Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Login;