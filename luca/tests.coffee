assert = require 'assert'
chai = require 'chai'
chai.use require 'chai-things'
expect = chai.expect
cashflow = require './cashflow.js'

describe 'validateCff', ->
  it 'should reject invalid object', ->
    inputs = 'string'
    x = cashflow inputs
    expect(x).to.be.a('object')
    expect(x).to.have.property('validationPassed').and.equal(false)
    expect(x).to.have.property('errors').and.to.have.length(1)
      .and.to.contain.an.item.with.property('msg', 'CFF is not a valid JSON object')



