const api = require('./restApi');
const device = require('./device');
global.devices = [];
new api();
new device('свет', 'люстра в комнате', 'devices.types.light', 'Спальня');
new device('свет', 'люстра на кухне', 'devices.types.light', 'Кухня');
new device('свет', 'свет в ванной', 'devices.types.light', 'Ванная');