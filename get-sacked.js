#!/usr/bin/env node

import axios from "axios";
import { format, subDays } from "date-fns";
import { access, readFile } from "fs/promises";
import { Readable } from "node:stream";
import { homedir } from "os";
import { setTimeout } from "timers/promises";

const USAGE = `${process.argv[1]} [days to look back]`;
const DAYS_BACK = +process.argv[2];

function checkArgs() {
  if (Number.isNaN(DAYS_BACK)) {
    return false;
  }
  return true;
}

async function getSlackToken() {
  const credPath = `${homedir()}/.slack/credentials.json`;
  // Check if it's there
  try {
    await access(credPath);
  } catch (err) {
    console.log(
      `Slack credentials file not found at ${credPath} - did you install the CLI?\n Do so at: https://api.slack.com/automation/cli/install`
    );
    return null;
  }
  const buff = await readFile(credPath);
  const creds = JSON.parse(buff.toString());

  const token = Object.values(creds)[0].token;
  // Just grab the token from the first one
  return token;
}

async function* scrollUsers() {
  const slackApiUrl = "https://slack.com/api/users.list";
  const limit = 500;
  let resp = await axios.get(slackApiUrl, {
    params: {
      limit,
    },
  });

  yield* resp.data.members;

  while (resp.data.response_metadata.next_cursor) {
    // go slower
    await setTimeout(1000);
    resp = await axios.get(slackApiUrl, {
      params: {
        limit,
        cursor: resp.data.response_metadata.next_cursor,
      },
    });
    yield* resp.data.members;
  }
}

async function* deletedUsers() {
  for await (const user of scrollUsers()) {
    if (user.deleted) {
      const deletedAt = new Date(user.updated * 1000);
      const yesterday = subDays(Date.now(), DAYS_BACK);
      if (user.profile.display_name && deletedAt > yesterday) {
        yield `${user.profile.display_name},${format(
          deletedAt,
          "MM-dd-yyyy"
        )}\n`;
      }
    }
  }
}

async function main() {
  // check the args
  const argsGood = checkArgs();
  if (!argsGood) {
    console.log(USAGE);
    process.exit(1);
  }

  // check the creds
  const token = await getSlackToken();
  if (!token) {
    process.exit(1);
  }

  axios.defaults.headers.get = {
    Authorization: `Bearer ${token}`,
  };

  // get our readable
  const readable = Readable.from(deletedUsers());

  // pipe it outtttt
  readable.pipe(process.stdout);
}

main();
