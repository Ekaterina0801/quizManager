import superagent from 'superagent'
import commonStore from '../store/commonStore'
const agent = superagent.agent()

agent.on('response', (res) => {
  if (res.status === 401) {
    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
  }
});

const tokenPlugin = (req) => {
  const token = commonStore.token 
  console.log('Using token:', token)
  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }
  req.withCredentials()
}

export { agent, tokenPlugin }