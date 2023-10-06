# WHO GOT SACKED?

Check Slack and see who got let go in the last few days.

## Getting Started

### Installation

First install the Slack CLI from [here](https://api.slack.com/automation/cli/install) and then run:

```sh
slack login
```

Next do an npm install:

```sh
npm i
```

This will put the script in your path for you so you can run it as `get-sacked` from anywhere :)

## Usage

```sh
get-sacked [days to look back]
```

### Example Usage

```sh
get-sacked.js 1
```

### Example Output

```
[{"username":"johnny.unlucky","realName":"Johnny Unlucky","sackedAt":"2023-10-06T15:29:23.000Z"}]

```
