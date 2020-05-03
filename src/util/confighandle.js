function chooseConfig(config) {
    if (!config.active) {
        throw new Error("没有指定使用的配置")
    }
    const activeConfig = config.configuration.filter(v => v.name === config.active)[0]
    if (activeConfig) {
        return activeConfig;
    }
    throw new Error("没有找到指定的配置");
}

module.exports = {
    chooseConfig
}