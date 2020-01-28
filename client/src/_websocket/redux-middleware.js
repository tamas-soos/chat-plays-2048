import { Socket } from "phoenix"

import {
  joinChannel,
  handleGameChannelMessages,
  handleChatChannelMessages,
} from "./utils"
import { SETUP_WEBSOCKET, JOIN_CHANNEL } from "./actions"
import { SEND_NEW_MESSAGE } from "../Chat/actions"
import { MAKE_MOVE, RESTART_GAME, CHANGE_GAME_MODE } from "../Game/actions"

const WS_URL = process.env.REACT_APP_WS_URL

export default function websocketMiddleware({ dispatch }) {
  let socket = null
  const channels = {}

  return next => action => {
    const { payload, type } = action

    switch (type) {
      case SETUP_WEBSOCKET:
        socket = new Socket(WS_URL, { params: { username: payload } })
        socket.connect()
        break

      case JOIN_CHANNEL:
        channels[payload.name] = joinChannel(socket, payload.topic, dispatch)

        if (payload.name === "game") {
          handleGameChannelMessages(channels, dispatch)
        }
        if (payload.name === "chat") {
          handleChatChannelMessages(channels, dispatch)
        }
        break

      case MAKE_MOVE:
        channels.game.push(`move:${payload}`)
        break

      case RESTART_GAME:
        channels.game.push("restart_game", { game_mode: payload })
        break

      case CHANGE_GAME_MODE:
        channels.game.push("change_game_mode", { game_mode: payload })
        break

      case SEND_NEW_MESSAGE:
        channels.chat.push("chat:new_msg", { body: payload })
        break

      default:
        break
    }

    return next(action)
  }
}
