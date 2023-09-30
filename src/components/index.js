import axios from "axios";

export const BASE_URL = 'http://localhost:5164/';

export const ENDPOINTS = {
     users: 'Users',
     replacingBookQuiz: 'ReplacingBookQuiz',
     leaderBoard: 'Leaderboard'
}

export const createAPIEndpoint = endpoint => {

     const url = `${BASE_URL}${endpoint}/`;

     switch (endpoint) {
          case ENDPOINTS.users:
               return {
                    login: newRecord => axios.post(url + 'login', newRecord),
                    signup: newRecord => axios.post(url + 'signup', newRecord)
               }
          case ENDPOINTS.replacingBookQuiz:
               return {
                    getReplacingBookData: () => axios.get(url + 'generateQuiz'),
                    replacingBookCalPoints: newRecord => axios.post(url + 'calculatePoints', newRecord),
                    replacingBookCorrectOrder: newRecord => axios.post(url + 'generateCorrectOrder', newRecord),
               }
          case ENDPOINTS.leaderBoard:
               return {
                    getLeaderboard: () => axios.get(url),
                    addOrUpdateLeaderBoardEntry: newRecord => axios.post(url + 'addOrUpdateLeaderboardEntry', newRecord),
               }
     }
}