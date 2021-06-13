const axios = require('axios');

exports.slackReporterFactory = slackReporterFactory;

function slackReporterFactory(uiBuilderDevID) {
  return async prs => {
    const enableMentions = 1;
    const text = getText(prs);

    const instance = createSlackHttpClient();

    await instance.post('', { channel: uiBuilderDevID, link_names: enableMentions, text: text });
  };
}

function getText(prs) {
  if (prs.length) {
    return getStalePRsText(prs);
  }

  return getNoStalePRsText();
}

function getNoStalePRsText() {
  return 'Сегодня ни одного пул реквеста не продолбано! Моё уважение.';
}

function getStalePRsText(prs) {
  return `За последние 24 часа с этими пул реквестами ничего не произошло:

${createStalePRsListText(prs)}`;
}

function createStalePRsListText(prs) {
  return prs.map(createStalePRText).join('\n');
}

function createStalePRText({ title, link, author, reviewer }) {
  const authorSlackId = getPRAuthorText(author);
  const reviewerSlackId = getPRReviewerText(authorSlackId, reviewer);
  return `*Грустный ПР:* <${link}|*${title}*>
*Забывчивый Автор:* ${authorSlackId}
*Кого пинать:* ${reviewerSlackId}
`;
}

function getPRAuthorText(author) {
  const githubNicknameToSlackIdMapping = {
    'SashaSkywalker': '<@U2UT5BV47>',
    'Tibing': '<@U2UUU5WKD>',
    'nnixaa': '<@U2UGV343F>',
    'sashaqred': '<@U011LDX8JA0>',
    'mmfKupl': '<@USFN3PCDU>',
    'Roma36': '<@UN9HLTSFJ>',
    'stas-karmanov': '<@U024W3Z1NN4>',
  }

  return githubNicknameToSlackIdMapping[author];
}

function getPRReviewerText(authorSlackId, reviewer) {
  const youtrackEmailToSlackIdMapping = {
    'n.poltoratsky@akveo.com': '<@U2UUU5WKD>',
    'a.demeshko@akveo.com': '<@U2UT5BV47>',
    'd.nehaychik@akveo.com': '<@U2UGV343F>',
    'i.kuplevich@akveo.com': '<@USFN3PCDU>',
    'r.grinovski@akveo.com': '<@UN9HLTSFJ>',
    'a.verbilo@akveo.com': '<@U011LDX8JA0>',
    'stanislav.karmanov@akveo.com': '<@U024W3Z1NN4>',
  };

  const reviewerSlackId = youtrackEmailToSlackIdMapping[reviewer];

  if (authorSlackId === reviewerSlackId) {
    return `${reviewerSlackId} Какого-то хуя`
  }

  if (!reviewerSlackId) {
    return `А вот нет там никакого ревьюера какого-то хуя`
  }

  return reviewerSlackId;
}

function createSlackHttpClient() {
  return axios.create({
    baseURL: `https://slack.com/api/chat.postMessage`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.SLACK_TOKEN,
    },
  })
}
