/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

declare namespace Express {
  interface Request {
    request_history?: any[];
    body: any;
    session: Session & ISession;
  }
}

declare namespace NodeJS {
  interface Global {
    detailCache: any;
    numbersCache: any;
    sessionEmitter: EventEmitter;
    mvno_sessions_store: MemoryStore;
  }
}
