const { verifySignature } = require('../utils');
const githubEvent = require('../githubEvent');

module.exports = function webhook(ctx) {
  let eventName = ctx.request.headers['x-github-event'];
  if (eventName && verifySignature(ctx.request)) {
    const payload = JSON.parse(ctx.request.body.payload);
    const action = payload.action;
    eventName += `_${action}`;
    console.log('receive event: ', eventName);
    if (payload.sender.login !== process.env.GITHUB_BOT_NAME) {
      githubEvent.emit(eventName, {
        repo: ctx.params.repo,
        payload,
      });
    }
    ctx.body = 'Ok.';
  } else {
    ctx.body = 'Go away.';
  }
}