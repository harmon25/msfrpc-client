var Docker = require('dockerode');

var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

var docker = new Docker({socketPath: socket});

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}

function testContainers (callback){
  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      var msfrpc = 'harmon25/msfdocker:latest'
      var msfpg = 'postgres:9.4'
      console.log(containerInfo.Id);
      console.log(containerInfo.Image.split(':')[0]);
    });
  });
}