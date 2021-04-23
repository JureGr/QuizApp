import * as actionTypes from './types';

/* User Actions */
export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    };
};

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER
    };
};

/* Quiz Actions */
export const setCurrentQuiz = quiz => {
    return {
        type: actionTypes.SET_CURRENT_QUIZ,
        payload: {
            currentQuiz: quiz
        }
    };
};

export const clearQuiz = () => {
    return {
        type: actionTypes.CLEAR_QUIZ
    };
};