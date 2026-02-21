exports.config = {
    app_name: ["NodejsNewRelic"],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    cloud: {
        aws: { enabled: false },
        azure: { enabled: false },
        gcp: { enabled: false }
    },
    application_logging: {
        forwarding: {
            enabled: true   // REQUIRED for app logging
        }
    },
    logging: {
        level: "info" // 4 types debug, warning , error, info
    }
    
}