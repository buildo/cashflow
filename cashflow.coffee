validateCff = (cff) ->
  errors = (e) ->
    validationPassed: e.length == 0
    errors: e

  e = []

  # check basic compliance
  unless typeof cff == 'object' and not Array.isArray cff
    e.push {msg: "CFF is not a valid JSON object"}
    return errors e

  # check presence of mandatory fields
  unless 'sourceId' in cff and typeof cff.sourceId == 'string'
    e.push {msg: "sourceId missing or invalid"}

  unless 'sourceDescription' in cff and typeof cff.sourceDescription == 'string'
    e.push {msg: "sourceDescription missing or invalid"}

  return errors e

# potremmo usare json-schema e tv4 per fare validation!!

validateAll = (inputs, validator) ->
  inputs = [inputs] unless Array.isArray inputs
  inputs.reduce (acc, input) ->
    validation = validator(input)
    # return accumulator
    validationPassed: acc.validationPassed and validation.validationPassed
    errors: acc.errors.concat validation.errors
  ,
  # initial accumulator value
  {validationPassed: true, errors: []}

processInputs = (inputCffs, heuristics) ->
  validation = validateAll inputCffs, validateCff

module.exports = (inputCffs, heuristics) ->
  processInputs(inputCffs, heuristics)
  # exported functions
  #getReport: getReport
