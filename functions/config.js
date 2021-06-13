const repositories = [
  'akveo/uibakery-frontend',
  'akveo/uibakery-backend',
];

const prodEnv = {
  env: 'prod',
  uiBuilderDevID: 'CE4FS5BV2',
  repositories: repositories,
  youtrack: 'https://akveo.myjetbrains.com/youtrack/api',
};

const devEnv = {
  env: 'dev',
  uiBuilderDevID: 'G01J9KEAU1K',
  repositories: repositories,
  youtrack: 'https://akveo.myjetbrains.com/youtrack/api',
};

const localEnv = {
  env: 'local',
  uiBuilderDevID: null,
  repositories: repositories,
  youtrack: 'https://akveo.myjetbrains.com/youtrack/api',
};

function getConfig() {
  const env = process.env.ENVIRONMENT;

  if (env === 'prod') {
    return prodEnv;
  }

  if (env === 'dev') {
    return devEnv;
  }

  if (env === 'local') {
    return localEnv;
  }

  throw new Error(`No env specified. Please, choose one: prod, dev or local`);
}

exports.config = getConfig();
