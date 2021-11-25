# Getting started

1. npm install -g firebase-tools

# How to test

curl \
  -H "Authorization: Bearer " \
  -d email="n.poltoratsky@akveo.com" \
  https://slack.com/api/users.lookupByEmail

curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer " \
  --request POST \
  --data '{ "channel": "G01J9KEAU1K", "text": "Hello world :tada:" }' \
  https://slack.com/api/chat.postMessage
