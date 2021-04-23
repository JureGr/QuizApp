import React from 'react';
import firebase from '../../firebase';
import { Button, Divider, Row, Col, notification, Avatar, Typography, Space } from 'antd';
import {
    PlusOutlined,
    InfoCircleTwoTone
} from '@ant-design/icons';
import NewQuestion from './NewQuestion';
import PlayQuiz from './PlayQuiz';

const { Text } = Typography;

class Quiz extends React.Component {
    state = {
        drawer: false,
        questionsRef: firebase.database().ref('questions'),
        questions: [],
        questionsLoading: true
    };

    componentDidMount() {
        const { currentQuiz, currentUser } = this.props;

        if (currentQuiz && currentUser) {
            this.addListeners(currentQuiz.id);
        }
    };

    addListeners = quizId => {
        this.addQuestionListener(quizId);
    };

    addQuestionListener = quizId => {
        let loadedQuestions = [];
        this.state.questionsRef.child(quizId).on('child_added', snap => {
            loadedQuestions.push(snap.val());
            this.setState({
                questions: loadedQuestions,
                questionsLoading: false
            });
        });
    };

    showDrawer = () => this.setState({ drawer: true });
    
    closeDrawer = () => this.setState({ drawer: false });

    openNotification = (info) => {
        notification.open({
          message: 'Quiz Info',
          description:`${info}`,
          placement: 'bottomRight',
        });
    };

    render() {
        const { currentUser, currentQuiz } = this.props;
        const { questionsRef, drawer, questions } = this.state;

        return (
            <div>
                <Row>
                    <Col span={8}>
                        <h2><b>{currentQuiz.name + " "}</b>
                        <InfoCircleTwoTone onClick={() => this.openNotification(currentQuiz.details)} /><Divider type="vertical" />
                        {currentUser.uid === currentQuiz.createdBy.id ?
                            <Button onClick={this.showDrawer} type="primary"><PlusOutlined />Add New Question</Button> :
                            ''
                        }</h2>
                    </Col>
                    <Col span={4} offset={12}>
                        <Space>
                            <Text mark>
                                Created By:
                            </Text>
                            <Avatar src={currentQuiz && currentQuiz.createdBy.avatar} />
                        </Space>
                        <Text strong>
                            {currentQuiz && ' ' + currentQuiz.createdBy.name}
                        </Text>
                    </Col>
                </Row>
                <NewQuestion 
                    questionsRef={questionsRef} 
                    drawer={drawer} 
                    closeDrawer={this.closeDrawer} 
                    currentQuiz={currentQuiz}
                />
                <Divider />
                <PlayQuiz questions={questions} />
            </div>
        );
    };
};

export default Quiz;