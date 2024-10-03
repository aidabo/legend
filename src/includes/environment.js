//https://ja.vitejs.dev/guide/env-and-mode.html

/**
import.meta.env.MODE: {string} アプリが動作しているモード。
import.meta.env.BASE_URL: {string} アプリが配信されているベース URL。これは base 設定オプション によって決まります。
import.meta.env.PROD: {boolean} アプリがプロダクションで動作しているかどうか。
import.meta.env.DEV: {boolean} アプリが開発で動作しているかどうか（常に import.meta.env.PROD の逆）
import.meta.env.SSR: {boolean} アプリがサーバで動作しているかどうか
*/

const getEnvironment = () => {
        var env = {
            "env": import.meta.env.MODE,
            "base_url": import.meta.env.BASE_URL,
            "prod": import.meta.env.PROD,
            "dev": import.meta.env.DEV,
            "ssr": import.meta.env.SSR,
            "web_api_url": import.meta.env.VITE_WEB_API_URL,
            "db_api_url": import.meta.env.VITE_PG_API_URL,
            "upload_api_url": `${import.meta.env.VITE_WEB_API_URL}/upload`,
            "download_api_url": `${import.meta.env.VITE_WEB_API_URL}/download`,
            "sendmail_api_url": `${import.meta.env.VITE_WEB_API_URL}/sendmail`,
        };
        return env;
}

export default getEnvironment;