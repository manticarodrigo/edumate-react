import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './components/App/App'
import registerServiceWorker from './registerServiceWorker'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-client-preset'
import { createUploadLink } from 'apollo-upload-client'

import { CURRENT_USER } from './constants'

const authLink = new ApolloLink((operation, forward) => {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER))
  const token = currentUser ? currentUser.token : null
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const client = new ApolloClient({
  link: authLink.concat(createUploadLink({ uri: 'http://localhost:4000' })),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)
registerServiceWorker()