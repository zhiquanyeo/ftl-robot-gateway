const logger = require('winston');
const commandLineArgs = require('command-line-args');

const optionDefs = [
	{ name: 'mock', alias: 'm', type: Boolean },
	{ name: 'port', alias: 'p', type: Number, defaultOption: true }
];

const DEFAULT_PORT = 41236;

// Initial Setup
const opts = commandLineArgs(optionDefs, { partial: true });

const useMocks = !!opts.mock;
const usePort = opts.port !== undefined ? opts.port : DEFAULT_PORT;

// If we are using mocks, start up mockery and register the mocks
if (useMocks) {
	logger.info('[SYS] Using Mocked Subsystems');
	const mockery = require('mockery');
	const mockI2c = require('./mocks/i2c-bus-mock');

	mockery.enable({
	    warnOnReplace: false,
	    warnOnUnregistered: false
	});

	mockery.registerMock('i2c-bus', mockI2c);
}

// Application Level components 
const AnsibleServer = require('ftl-ansible').AnsibleServer;
const Robot = require('ftl-robot-host').Robot;
const RobotConfig = require('./robot-config');

// === Main Application Logic ===
logger.info('[GWY] Starting Gateway');

var server = new AnsibleServer({ port: usePort });
var robot = new Robot(RobotConfig);

// Hook up events
server.on('commandReceived', (cmdEvt) => {

});

server.on('dataRequired', (dataEvt) => {

});

