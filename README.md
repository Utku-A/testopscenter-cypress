
# TestOps Center - Cypress Reporter

The tests you write in Cypress are a tool used for reporting in TestOps Center.

To use this extension, you first need to sign up on testopscenter.com.

## Installation

```bash
npm i testopscenter-cypress
```

Add the 'reporter.connect(on, team_spkey)' method to the 'cypress.config.js' file as shown below, and enter the SPKEY value from your team information.

> If you want the version name to appear in the report, you can enter the version name in the 'version_name' field as shown below.

```javascript
// cypress.config.js

const { defineConfig } = require("cypress");
const reporter = require("testopscenter-cypress");


let team_spkey = "{TEAM SPKEY VALUE}"
let version_name = "QA ENV Web Site" // Optional

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      reporter.connect(on,team_spkey,version_name)
    },
  },
});

```

 Everything is that simple :)