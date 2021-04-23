import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import './App.css';
import SidePanel from './SidePanel/SidePanel';
import Quiz from './Quiz/Quiz';
import RandomQuiz from './Quiz/RandomQuiz';
import { clearQuiz } from '../actions';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
    state = {
        collapsed: false,
        random: true
    };

    componentDidMount() {
        this.props.clearQuiz();
    }

    notRandom = () => {
        this.setState({
            random: false
        });
    };

    isRandom = () => {
        this.setState({
            random: true
        });
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout>
                <SidePanel 
                    key={this.props.currentUser && this.props.currentUser.uid}
                    clearQuiz={this.props.clearQuiz} 
                    currentUser={this.props.currentUser} 
                    collapsed={this.state.collapsed} 
                    notRandom={this.notRandom}
                    isRandom={this.isRandom}
                />
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle,
                        })}
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                        margin: '14px 14px',
                        padding: 24,
                        minHeight: 590,
                        }}
                    >
                        {this.props.currentQuiz ? 
                            <Quiz 
                                key={ this.props.currentQuiz && this.props.currentQuiz.id }
                                currentUser={this.props.currentUser} 
                                currentQuiz={this.props.currentQuiz} 
                            /> :
                            null
                        }
                        {this.state.random ? 
                            <RandomQuiz /> :
                            null
                        }
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Shaunovi kvizovi ©2020 Created by Shaun</Footer>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    currentQuiz: state.quiz.currentQuiz
});

export default connect(mapStateToProps, { clearQuiz })(App);