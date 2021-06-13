exports.report = report;

async function report(prs) {
  const reporter = getReporter();
  return reporter(prs);
}

function getReporter() {
  const config = require('../config').config;

  if (['prod', 'dev'].includes(config.env)) {
    const slackReporterFactory = require('./reporter.slack').slackReporterFactory;
    return slackReporterFactory(config.uiBuilderDevID);
  }

  if (config.env === 'local') {
    return require('./reporter.local').localReporter;
  }

  throw new Error(`Can't find reporter for specified env.`);
}
