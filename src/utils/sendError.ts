export function sendError(res: any, msg: string) {
  res.status(400).send({
    status: "fail",
    message: msg,
  });
}
