exports.localReporter = localReporter;

function localReporter(prs) {
  console.log(JSON.stringify(prs, null, 2));
}
