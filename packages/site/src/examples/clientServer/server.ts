import { ActionCall, applyAction, deserializeActionCall, getSnapshot } from "mobx-keystone"
import { createRootStore } from "../todoList/store"

type MsgListener = (actionCall: ActionCall) => void

class Server {
  private serverRootStore = createRootStore()
  private msgListeners: MsgListener[] = []

  getInitialState() {
    return getSnapshot(this.serverRootStore)
  }

  onMessage(listener: (actionCall: ActionCall) => void) {
    this.msgListeners.push(listener)
  }

  sendMessage(actionCall: ActionCall) {
    // the timeouts are just to simulate network delays
    setTimeout(() => {
      const deserializedActionCall = deserializeActionCall(actionCall)

      // apply the action over the server root store
      // sometimes applying actions might fail (for example on invalid operations
      // such as when one client asks to delete a model from an array and other asks to mutate it)
      // so we try / catch it
      let applyActionSucceeded = false
      try {
        applyAction(this.serverRootStore, deserializedActionCall)
        applyActionSucceeded = true
      } catch (err) {
        console.error("error applying action to server:", err)
      }

      if (applyActionSucceeded) {
        setTimeout(() => {
          // and distribute message
          this.msgListeners.forEach(listener => listener(actionCall))
        }, 500)
      }
    }, 500)
  }
}

export const server = new Server()
