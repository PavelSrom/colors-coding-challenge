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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// https://stackoverflow.com/questions/46907761/node-js-promisify-readline
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
    "What colors do you want? If all colors, type 'all', if multiple, please separate by spaces: "
  )
  const { error, colors } = validateColors(colorsInput)
  if (error) return endReadline(rl)

  const colorFormatInput = await userInput(
    "What format do you want returned? Choose between 'all' / 'HEX' / 'RGB': "
  )
  const isCorrectColorFormat = validateColorFormat(colorFormatInput)
  if (!isCorrectColorFormat) return endReadline(rl)

  // if we have multiple colors going on, the program continues
  if (Array.isArray(colors)) {
    const sortOrderInput = await userInput(
      "How do you want the colors to be sorted? Choose 'asc' / 'desc' / 'none': "
    )
    const isCorrectSortFormat = validateSortFormat(sortOrderInput)
    if (!isCorrectSortFormat) return endReadline(rl)

    const colorsAfterSort = sortColors(colors, sortOrderInput)

    const syncOrAsyncInput = await userInput(
      "How do you want the colors to be fetched? Choose 'sync' / 'async': "
    )
    const isCorrectSyncFormat = validateSyncAsync(syncOrAsyncInput)
    if (!isCorrectSyncFormat) return endReadline(rl)

    if (syncOrAsyncInput === "sync") {
      for (const color of colorsAfterSort) {
        const targetColor = await fetchColorAndFormat(color, colorFormatInput)
        console.log("Here's your winner:")
        console.log(targetColor)
      }
    } else {
      const listOfPromises = []

      for (const color of colorsAfterSort) {
        listOfPromises.push(fetchColorAndFormat(color, colorFormatInput))
      }

      const allColors = await Promise.all(listOfPromises)
      console.log("Here's your winner:")
      console.log(JSON.stringify(allColors, null, 2))
    }
  } else {
    // the user asked for only one color => no sorting, no sync/async behavior
    const targetColor = await fetchColorAndFormat(colors, colorFormatInput)
    console.log("Here's your winner:")
    console.log(targetColor)
  }

  rl.close()
}

main()
