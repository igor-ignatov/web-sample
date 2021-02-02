function sse(event: { type: string; data: any }): void {
  const listeners = global.sessionEmitter.eventNames().filter((l) => String(l).includes("mvno_event"));

  for (const listener of listeners) {
    const emit_result = global.sessionEmitter.emit(listener, JSON.stringify(event));
    console.log(">>> Emit result: ".blue, listener, emit_result);
  }
}

export default sse;
