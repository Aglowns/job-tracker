// Quick parser test script - No database needed!
// Run with: node test-parsers.js

const fs = require('fs');
const path = require('path');

// Load sample emails
const greenhouseSample = require('./packages/parsers/fixtures/greenhouse-sample.json');
const leverSample = require('./packages/parsers/fixtures/lever-sample.json');
const workdaySample = require('./packages/parsers/fixtures/workday-sample.json');
const genericSample = require('./packages/parsers/fixtures/generic-sample.json');

console.log('📧 Testing Email Parsers (No Database Required)\n');
console.log('=' .repeat(60));

// Note: To actually run the parsers, you'd need to build the packages first
// But you can see the fixtures and what they should parse to:

console.log('\n✅ Greenhouse Email Sample:');
console.log('   From:', greenhouseSample.sender);
console.log('   Subject:', greenhouseSample.subject);
console.log('   Should extract: "Senior Software Engineer" at "TechCorp Inc"');
console.log('   Location: "San Francisco, CA"');

console.log('\n✅ Lever Email Sample:');
console.log('   From:', leverSample.sender);
console.log('   Subject:', leverSample.subject);
console.log('   Should extract: "Frontend Developer" at "StartupXYZ"');

console.log('\n✅ Workday Email Sample:');
console.log('   From:', workdaySample.sender);
console.log('   Subject:', workdaySample.subject);
console.log('   Should extract: "Full Stack Engineer" at "BigTech Inc"');

console.log('\n✅ Generic Email Sample:');
console.log('   From:', genericSample.sender);
console.log('   Subject:', genericSample.subject);
console.log('   Should extract: "Backend Engineer" at "SmallCompany"');

console.log('\n' + '='.repeat(60));
console.log('\n💡 To run actual parser tests:');
console.log('   1. pnpm install');
console.log('   2. cd packages/parsers');
console.log('   3. pnpm test');
console.log('\n📚 All test fixtures are in: packages/parsers/fixtures/\n');

