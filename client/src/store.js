import { combineReducers, createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import gridReducer from "./Grid/reducer"
import websocketMiddleware from "./websocket/redux-middleware"

export default function setupStore() {
  const rootReducer = combineReducers({
    grid: gridReducer,
  })

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(websocketMiddleware)),
  )

  return store
}
