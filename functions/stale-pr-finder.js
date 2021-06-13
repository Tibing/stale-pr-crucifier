const axios = require('axios');
const config = require('./config').config;

exports.findStalePRs = findStalePRs;

async function findStalePRs() {
  const prs = await findStalePRsOnGitHub();

  const result = [];
  for (const pr of prs) {
      const reviewerEmail = await findReviewerEmailAtYoutrack(pr);

      result.push({
        title: pr.title,
        link: pr.html_url,
        author: pr.user.login,
        reviewer: reviewerEmail,
      });
  }
  return result;
}

async function findStalePRsOnGitHub() {
  const prs = await getAllOpenPRs();
  return prs.filter(keepOnlyStalePRs);
}

async function getAllOpenPRs() {
  const instance = createGitHubHttpClient();
  const repositories = config.repositories;
  const issues = []

  for (const repository of repositories) {
    const res = await instance.get(`${repository}/issues`);
    issues.push(...res.data);
  }

  return issues;
}

function keepOnlyStalePRs(pr) {
  const updatedAt = new Date(pr.updated_at);
  const now = new Date();
  const diffMilliseconds = now.getTime() - updatedAt.getTime();
  const diffHours = diffMilliseconds / 1000 / 60 / 60;
  const possibleDiffHours = 24; // fuck devs if they don't touch pr for a day for some reason

  return diffHours > possibleDiffHours;
}

function createGitHubHttpClient() {
  return axios.create({
    baseURL: 'https://api.github.com/repos/',
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    params: {
      state: 'open',
      filter: 'is:pr',
    },
    auth: {
      username: 'Tibing',
      password: process.env.GITHUB_TOKEN,
    },
  });
}

async function findReviewerEmailAtYoutrack(pr) {
  const instance = createYoutrackHttpClient();
  const issueLinkRegexp = /https\:\/\/akveo\.myjetbrains\.com\/youtrack\/issue\/(UIB\_DEV\_UB\-\d*)/g;
  const matches = issueLinkRegexp.exec(pr.body);
  const youtrackTicketId = matches && matches.length ? matches[1] : null;
  const youtrackIssueRes = await instance.get('/issues/' + youtrackTicketId, {
    params: {
      fields: '$type,id,summary,customFields($type,id,projectCustomField($type,id,field($type,id,name)),value($type,id,email))',
    },
  });
  const youtrackIssue = youtrackIssueRes.data;
  const assigneeField = youtrackIssue.customFields.find(field => field.projectCustomField.field.name === 'Assignee');

  return assigneeField.value.email;
}

function createYoutrackHttpClient() {
  return axios.create({
    baseURL: config.youtrack,
    headers: {
      'Authorization': `Bearer ${process.env.YOUTRACK_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
