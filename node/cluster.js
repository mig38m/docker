if (cluster.isMaster) {
    cluster.on('exit', (worker, exitCode) => {
        if (exitCode !== SUCCESS) {
            cluster.fork();
        }
    });
    for (let i = 0; i < serverConfig.cpuCores; i++) {
        cluster.fork();
    }
} else {
    runApp();
}
