import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialUserState = {
    currentUser: null,
    isLoading: true
};

const user_reducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
            case actionTypes.CLEAR_USER:
                return {
                    ...state,
                    isLoading: false
                }
        default:
            return state;
    }
};

const initialQuizState = {
    currentQuiz: null
};

const quiz_reducer = (state = initialQuizState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_QUIZ:
            return {
                ...state,
                currentQuiz: action.payload.currentQuiz
            }
        case actionTypes.CLEAR_QUIZ:
            return {
                ...state,
                currentQuiz: null
            }
        default:
            return state;
    };
};

const rootReducer = combineReducers({
    user: user_reducer,
    quiz: quiz_reducer
});

export default rootReducer;