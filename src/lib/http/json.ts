export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return Response.json(body, init);
}

export function jsonError(message: string, status = 400): Response {
  return jsonResponse({ error: message }, { status });
}
