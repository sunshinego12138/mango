import Elysia from "elysia";

const app = new Elysia().ws('/ws', {
  message(ws, message) {
      
  },
})