export function JsonResponse(data: Record<string, any>, code: number) {
  return new Response(JSON.stringify(data), {
    status: code,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
