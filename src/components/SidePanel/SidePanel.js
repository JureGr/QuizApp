import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentQuiz } from '../../actions';
import { Layout, Menu, Avatar, Modal, Form, Input } from 'antd';
import {
    HomeOutlined,
    RocketOutlined,
    PlusOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

class SidePanel extends React.Component {
    state = {
        activeQuiz: "",
        user: this.props.currentUser,
        quizzes: [],
        quizName: "",
        quizDetails: "",
        quizzesRef: firebase.database().ref('quizzes'),
        modal: false
    };

    componentDidMount() {
        this.addListeners();
    };

    componentWillUnmount() {
        this.removeListeners();
    };

    addListeners = () => {
        let loadedQuizzes = [];
        this.state.quizzesRef.on('child_added', snap => {
            loadedQuizzes.push(snap.val());
            this.setState({ quizzes: loadedQuizzes });
        });
    };

    removeListeners = () => {
        this.state.quizzesRef.off();
    };

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out!'))
    };

    addQuiz = () => {
        const { quizzesRef, quizName, quizDetails, user } = this.state;

        const key = quizzesRef.push().key;

        const newQuiz = {
            id: key,
            name: quizName,
            details: quizDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
                id: user.uid
            }
        };

        quizzesRef
            .child(key)
            .update(newQuiz)
            .then(() => {
                this.setState({ quizName: '', quizDetails: '' });
                this.closeModal();
                console.log('quiz added');
            })
            .catch(err => {
                console.error(err);
            })
    };

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addQuiz();
        }
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    changeQuiz = quiz => {
        this.setActiveQuiz(quiz);
        this.props.setCurrentQuiz(quiz);
        this.props.notRandom();
    };

    setActiveQuiz = quiz => {
        this.setState({ activeQuiz: quiz.id });
    };

    onHomeButton = () => {
        this.props.clearQuiz();
        this.props.isRandom();
    }

    displayQuizzes = quizzes => (
        quizzes.length > 0 && quizzes.map(quiz => (
            <Menu.Item
                key={quiz.id}
                onClick={() => this.changeQuiz(quiz)}
                name={quiz.name}
            >
                # {quiz.name}
            </Menu.Item>
        ))
    )

    isFormValid = ({ quizName, quizDetails }) => quizName && quizDetails;

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {
        const { collapsed } = this.props;
        const { user, quizzes, modal } = this.state;

        return(
            <React.Fragment>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={["home"]}>
                        <SubMenu 
                            key="sub1" 
                            title={
                                <span>
                                    <Avatar src={user && user.photoURL} />
                                    {user && ' ' + user.displayName}
                                </span>}
                        >
                            <Menu.Item key="user" disabled><span>Signed in as <strong>{user && user.displayName}</strong></span></Menu.Item>
                            <Menu.Item key="signout">
                                <span onClick={this.handleSignout}>
                                    Sign Out
                                </span>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="home" onClick={this.onHomeButton} icon={<HomeOutlined />}>
                            Home Page
                        </Menu.Item>
                        <SubMenu 
                            key="quizzes"
                            title="Quizzes"
                            icon={<RocketOutlined />}
                        >
                            <Menu.Item key="newQuiz" onClick={this.openModal}><PlusOutlined /> New Quiz</Menu.Item>
                            {this.displayQuizzes(quizzes)}
                        </SubMenu>
                    </Menu>
                </Sider>

                {/* Add Quiz Modal */}
                <Modal title="Add new quiz" okText="Add" onOk={this.handleSubmit} visible={modal} onCancel={this.closeModal}>
                    <Form>
                        <Form.Item>
                            <Input 
                                placeholder="Name of Quiz"
                                name="quizName"
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input 
                                placeholder="About the Quiz"
                                name="quizDetails"
                                onChange={this.handleChange}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(
    null, 
    { setCurrentQuiz }
)(SidePanel);