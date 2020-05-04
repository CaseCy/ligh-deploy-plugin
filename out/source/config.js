"use strict";
const config = {
    active: 'dev',
    configuration: [{
            name: 'dev',
            ssh: {
                host: "172.16.3.33",
                port: 22,
                username: "root",
                password: "root",
            },
            build: {
                cmd: 'npm run build'
            },
            autoBuild: true,
            autoCompress: true,
            autoBak: true,
            local: {
                projectRootPath: 'H:/web/ecma-test',
                buildOutDir: 'dist',
            },
            remote: {
                // deleteBeforeDeploy: false,
                bakPath: '~/bak',
                releasePath: '/netty-socket/web',
            }
        }]
};
module.exports = config;
//# sourceMappingURL=config.js.map