#!/bin/bash
MOZ_HEADLESS=1 CHROME_BIN=$(which chromium-browser) ./node_modules/karma/bin/karma start
