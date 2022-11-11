import { config as readEnv } from 'dotenv';
import { join } from 'path';
import { Dialect } from 'sequelize/types';

function makeConfig(envFile) {
    const { parsed } = readEnv({ path: envFile });

    return {
        db: {
            vendor: parsed.DB_VENDOR as Dialect,
            host: parsed.DB_HOST,
            logging: parsed.DB_LOGGING === 'true',
        },
    };
}

//const envTestingFile = join(__dirname, '../../../../.env.${process.env.NODE_ENV}');

const envTestingFile = join(__dirname, '../../../../.env.test');
let configTest = null;

export const getConfig = () => {
    if (!configTest) {
        configTest = makeConfig(envTestingFile);
    }

    return configTest;
};
