# WHO GOT SACKED?

Check Slack and see who got let go in the last few days.
<br>
I'm really smart so this should handle arbitrarily large user bases without getting rate-limited.

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
get-sacked 1
```

### Example Output

Output is a streaming list of comma separated values

```
Johnny Unlucky, 02-30-2023
Marcy Mei, 02-30-2023
```
