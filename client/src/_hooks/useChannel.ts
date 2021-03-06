import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppState } from "../store"
import { joinChannel } from "../_websocket/actions"
import { Channel } from "../_common/_types/Channel"
import { WebsocketState } from "../_websocket/_types/WebsocketState"

export default function useChannel(channel: Channel) {
  const dispatch = useDispatch()
  const { isConnected } = useSelector<AppState, WebsocketState>(
    state => state.websocket,
  )

  useEffect(() => {
    if (isConnected) {
      dispatch(joinChannel(channel))
    }
  }, [dispatch, channel, isConnected])
}
