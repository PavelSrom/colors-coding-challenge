const readline = require("readline") // built-in Node module
const {
  validateColors,
  validateColorFormat,
  validateSortFormat,
  validateSyncAsync,
  sortColors,
  fetchColorAndFormat,
  endReadline,
} = require("./helpers")

/**
 * COOKBOOK:
 *
 * 1. what colors to return (all / single / spaced input of colors)
 * 2. what format (RGB / HEX / all)
 * 3. only multiple colors - what order (asc / desc / individually??)
 * 4. only multiple colors - synchronous or not?
 */

// create a readline instance
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// https://stackoverflow.com/questions/46907761/node-js-promisify-readline
// promisify readline inputs so that we can use async/await
const userInput = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

/**
 * ============================================================================
 */

const main = async () => {
  const colorsInput = await userInput(
    // ask first question
    "What colors do you want? If all colors, type 'all', if multiple, please separate by spaces: "
  )
  const { error, colors } = validateColors(colorsInput) // validate answer
  if (error) return endReadline(rl) // if invalid answer, stop execution

  const colorFormatInput = await userInput(
    // ask second question
    "What format do you want returned? Choose between 'all' / 'HEX' / 'RGB': "
  )
  const isCorrectColorFormat = validateColorFormat(colorFormatInput) // validate answer
  if (!isCorrectColorFormat) return endReadline(rl) // if invalid answer, stop execution

  // if we have multiple colors going on, the program continues
  if (Array.isArray(colors)) {
    const sortOrderInput = await userInput(
      // ask third question
      "How do you want the colors to be sorted? Choose 'asc' / 'desc' / 'none': "
    )
    const isCorrectSortFormat = validateSortFormat(sortOrderInput) // validate answer
    if (!isCorrectSortFormat) return endReadline(rl) // if invalid answer, stop execution

    const colorsAfterSort = sortColors(colors, sortOrderInput) // sort colors

    const syncOrAsyncInput = await userInput(
      // ask fourth question
      "How do you want the colors to be fetched? Choose 'sync' / 'async': "
    )
    const isCorrectSyncFormat = validateSyncAsync(syncOrAsyncInput) // validate answer
    if (!isCorrectSyncFormat) return endReadline(rl) // if invalid answer, stop execution

    if (syncOrAsyncInput === "sync") {
      // if sync order, loop through colors, fetch one by one and log to terminal
      for (const color of colorsAfterSort) {
        const targetColor = await fetchColorAndFormat(color, colorFormatInput)
        console.log("Here's your winner:")
        console.log(targetColor)
      }
    } else {
      // otherwise create a list of promises
      const listOfPromises = []
      for (const color of colorsAfterSort) {
        // push each fetch call for the color to the list
        listOfPromises.push(fetchColorAndFormat(color, colorFormatInput))
      }
      // fetch all colors simultaneously
      const allColors = await Promise.all(listOfPromises)
      console.log("Here's your winner:")
      // format answer
      console.log(JSON.stringify(allColors, null, 2))
    }
  } else {
    // the user asked for only one color => no sorting, no sync/async behavior
    const targetColor = await fetchColorAndFormat(colors, colorFormatInput)
    console.log("Here's your winner:")
    console.log(targetColor)
  }
  // exit terminal
  rl.close()
}

main()
