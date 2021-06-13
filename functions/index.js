const functions = require('firebase-functions');
const report = require('./reporter/reporter').report;
const findStalePRs = require('./stale-pr-finder').findStalePRs;

exports.scheduledFunction = functions.https.onRequest(async (req, res) => {
  validateRequiredTokensProvided();

  const prs = await findStalePRs();
  await report(prs);

  res.json({ result: `${prs.length} Stale PRs Reported` });
});

function validateRequiredTokensProvided() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error(`No GitHub token provided.`);
  }

  if (!process.env.SLACK_TOKEN) {
    throw new Error(`No Slack token provided.`);
  }

  if (!process.env.YOUTRACK_TOKEN) {
    throw new Error(`No Youtrack token provided.`);
  }
}
