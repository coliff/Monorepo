#!/usr/bin/env node

// const { capture } = require('./dist/capture.mjs')
import { capture } from './dist/capture.mjs'

capture()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
